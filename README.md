# homebrew-claude-rpc

Homebrew tap for [claude-rpc](https://github.com/rar-file/claude-rpc) — Discord Rich Presence for Claude Code.

```sh
brew install rar-file/claude-rpc/claude-rpc
claude-rpc setup
```

The formula follows the latest npm release on its own: [`bump.yml`](.github/workflows/bump.yml) checks npm hourly (and on dispatch from the main repo's release workflow), verifies the tarball against npm's integrity hash, and commits the new url + sha256.
