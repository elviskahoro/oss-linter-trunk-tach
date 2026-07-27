# tach

A Trunk plugin for [Tach](https://docs.gauge.sh/), a Python tool that enforces module dependencies and interfaces (import-graph boundaries) between the parts of your codebase.

## Installation

Add the plugin source and enable the linter in your `.trunk/trunk.yaml`:

```yaml
plugins:
  sources:
    - id: tach-plugin
      ref: v0.1.0
      uri: https://github.com/elviskahoro/oss-linter-trunk-tach

lint:
  enabled:
    - tach@0.35.0
```

Or use the CLI:

```bash
trunk plugins add https://github.com/elviskahoro/oss-linter-trunk-tach v0.1.0 --id=tach-plugin
trunk check enable tach
```

## About

Tach checks the import graph of a Python project against a set of declared module boundaries, so accidental cross-module or cross-layer imports fail fast instead of drifting into circular or leaky dependencies. It:

- Checks the **whole module graph** in a single pass rather than per-file
- Reads its rules from `tach.toml` (`source_roots`, `[[modules]]` blocks with `path` / `depends_on` / `utility`)
- Exits `0` on a clean graph, `1` when boundary violations are found

## Configuration

### Basic Usage

The plugin runs `tach check` unmodified — no flags are added by default:

```bash
trunk check tach
```

### Tach Configuration

Tach reads its rules from `tach.toml` at the project root:

```toml
source_roots = ["."]

[[modules]]
path = "libs.telemetry"
utility = true

[[modules]]
path = "cli"
depends_on = ["libs.telemetry"]
```

See the [Tach configuration docs](https://docs.gauge.sh/usage/configuration/) for all options.

### Custom Command Options

To customize the linter behavior, override the definition in your `.trunk/trunk.yaml`:

```yaml
lint:
  definitions:
    - name: tach
      commands:
        - name: lint
          run: tach check --exclude tests
```

## Ignoring Issues

### Inline Suppression

```python
from db.main import PrivateAPI  # tach-ignore
```

See the [Tach Ignore docs](https://docs.gauge.sh/usage/tach-ignore/) for scoping an ignore to a specific import and attaching a reason.

### Via Trunk

```yaml
lint:
  ignore:
    - linters: [tach]
      paths:
        - path/to/file.py
```

## What It Catches

### Cross-Module Boundary Violations

```toml
# tach.toml
[[modules]]
path = "libs.apollo"
depends_on = ["libs.telemetry"]

[[modules]]
path = "libs.attio"
depends_on = ["libs.telemetry"]
```

```python
# libs/apollo/client.py
# FAIL: libs/apollo/client.py:1: Cannot use 'libs.attio.client.AttioClient';
# current module 'libs.apollo' does not depend on 'libs.attio'.
from libs.attio.client import AttioClient
```

### Circular Dependencies

With `forbid_circular_dependencies = true` in `tach.toml`, a cycle between two modules' `depends_on` lists is reported the same way as a one-way violation.

## Testing

To test the plugin locally:

```bash
# Run tach on the whole project (tach ignores file targets, so this always
# checks the full graph regardless of what you pass)
trunk check tach --verbose

# Force re-check (bypass cache)
trunk check tach --force

# Run tach directly for comparison
tach check
```

Editing `tach.toml` itself invalidates the Trunk cache (`affects_cache`) and can surface pre-existing violations in files outside your current diff — this is expected: loosening or restructuring the module graph shouldn't hide violations that were already there.

## Compatibility

- **Python versions**: 3.9+
- **Trunk CLI**: 1.7.0+
- **Tach**: 0.35.0+

## Contributing

Issues and contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT — See the [upstream Tach project](https://github.com/gauge-sh/tach) for details.
