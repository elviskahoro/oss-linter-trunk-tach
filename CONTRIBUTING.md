# Contributing to tach Trunk Plugin

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/elviskahoro/oss-linter-trunk-tach.git
   cd oss-linter-trunk-tach
   ```

2. **Install dependencies:**
   ```bash
   curl https://get.trunk.io -fsSL | bash
   trunk check
   ```

3. **Install tach:**
   ```bash
   pip install tach
   ```

## Testing

```bash
# Run all tests
trunk check

# Run only this plugin
trunk check tach

# Verbose output
trunk check --verbose
```

### Manual Testing

```bash
cd test_data
cat > module_a/basic.in.py << 'EOF'
from module_b import helper

result = helper()
EOF

tach check
echo $?  # 1 = boundary violations found, 0 = clean
```

## Making Changes

1. Update `plugin.yaml` with your changes
2. Run `trunk check` to validate
3. Test with `trunk check tach --force`

### Test Data

`test_data/` is a two-module fixture with its own `tach.toml` (tach checks the whole graph, unlike single-file linters, so the fixture needs a real project layout rather than one file):

1. Add new modules under `test_data/` and declare them in `test_data/tach.toml`
2. Update `tach.test.ts` to reference the new test

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Test thoroughly: `trunk check`
4. Commit: `git commit -m "feat: description"`
5. Push and open a pull request

## Submitting to Official Trunk Plugins

Submit to [trunk-io/plugins](https://github.com/trunk-io/plugins):

1. Fork https://github.com/trunk-io/plugins
2. Copy plugin files into `linters/tach/`
3. Follow their [contribution guidelines](https://github.com/trunk-io/plugins/blob/main/CONTRIBUTING.md)
4. Open a PR
