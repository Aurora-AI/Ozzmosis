# MCP — Genesis

## Goal
Enable MCP Store integrations (BigQuery/AlloyDB) without committing secrets.

## Rules
- Never commit real credentials.
- Use `servers.example.json` as template only.
- Real `servers.json` must remain local-only and ignored.

## Suggested Servers
- bigquery
- alloydb
