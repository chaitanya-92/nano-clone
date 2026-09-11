#!/usr/bin/env python3
"""Capture only user prompts and final assistant responses for 8x review."""

from __future__ import annotations

import fcntl
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LOG_DIR = ROOT / ".agent-logs"
PROJECT = ROOT.name


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def filename_time(timestamp: str) -> str:
    return timestamp.replace("Z", "").replace("T", "_").replace(":", "-")


def sanitize_session_id(session_id: str) -> str:
    safe = re.sub(r"[^A-Za-z0-9_.-]+", "-", session_id).strip(".-")
    return safe or "unknown-session"


def yaml_scalar(value: object) -> str:
    text = "" if value is None else str(value)
    return json.dumps(text)


def read_stdin_json() -> dict:
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def find_session_log(session_id: str) -> Path | None:
    if not LOG_DIR.exists():
        return None
    needle = f"session_id: {yaml_scalar(session_id)}"
    for path in sorted(LOG_DIR.glob("*.md")):
        try:
            head = path.read_text(encoding="utf-8", errors="replace").split("---", 2)
        except OSError:
            continue
        if len(head) >= 3 and needle in head[1]:
            return path
    return None


def parse_existing(path: Path) -> tuple[dict[str, str], str]:
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return {}, ""
    if text.startswith("---\n"):
        parts = text.split("---\n", 2)
        if len(parts) == 3:
            meta: dict[str, str] = {}
            for line in parts[1].splitlines():
                if ":" not in line:
                    continue
                key, value = line.split(":", 1)
                value = value.strip()
                try:
                    parsed = json.loads(value)
                    meta[key.strip()] = "" if parsed is None else str(parsed)
                except json.JSONDecodeError:
                    meta[key.strip()] = value
            return meta, parts[2].lstrip("\n")
    return {}, text


def render_log(meta: dict[str, str], body: str) -> str:
    ordered_keys = [
        "session_id",
        "date",
        "author",
        "model",
        "tool",
        "project",
        "total_exchanges",
        "first_prompt_time",
        "last_prompt_time",
    ]
    lines = ["---"]
    for key in ordered_keys:
        value: object = int(meta[key]) if key == "total_exchanges" and str(meta.get(key, "")).isdigit() else meta.get(key, "")
        lines.append(f"{key}: {yaml_scalar(value) if key != 'total_exchanges' else value}")
    lines.extend(["---", "", body.rstrip(), ""])
    return "\n".join(lines)


def append_event(data: dict) -> None:
    event = str(data.get("hook_event_name", ""))
    if event not in {"UserPromptSubmit", "Stop"}:
        return

    session_id = sanitize_session_id(str(data.get("session_id") or "unknown-session"))
    model = str(data.get("model") or "unknown")
    now = utc_now()

    LOG_DIR.mkdir(parents=True, exist_ok=True)
    lock_path = LOG_DIR / ".capture.lock"
    with lock_path.open("w", encoding="utf-8") as lock_file:
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)

        path = find_session_log(session_id)
        if path is None:
            path = LOG_DIR / f"{filename_time(now)}_{session_id}.md"

        meta, body = parse_existing(path)
        meta.setdefault("session_id", session_id)
        meta.setdefault("date", now[:10])
        meta.setdefault("author", "OpenAI Codex CLI")
        meta["model"] = model
        meta.setdefault("tool", "OpenAI Codex CLI hooks")
        meta.setdefault("project", PROJECT)
        meta.setdefault("first_prompt_time", now)
        meta["last_prompt_time"] = now

        if event == "UserPromptSubmit":
            prompt = str(data.get("prompt") or "")
            body += f"## User Prompt - {now}\n\n```text\n{prompt}\n```\n\n"
        else:
            response = data.get("last_assistant_message")
            if response is None:
                response = ""
            body += f"## Final Assistant Response - {now}\n\n```text\n{response}\n```\n\n"

        prompts = len(re.findall(r"^## User Prompt - ", body, flags=re.MULTILINE))
        finals = len(re.findall(r"^## Final Assistant Response - ", body, flags=re.MULTILINE))
        meta["total_exchanges"] = str(min(prompts, finals))

        path.write_text(render_log(meta, body), encoding="utf-8")


def main() -> int:
    append_event(read_stdin_json())
    print(json.dumps({"continue": True}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
