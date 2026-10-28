# Homebrew formula for claude-rpc (https://github.com/rar-file/claude-rpc).
#
# url + sha256 are kept on the latest npm release by .github/workflows/bump.yml
# (hourly, or on dispatch from the main repo's release workflow). Edit the rest
# of the formula here by hand; the bump only rewrites those two lines.
class ClaudeRpc < Formula
  desc "Discord Rich Presence for Claude Code: live model, project, tokens and stats"
  homepage "https://claude-rpc.com"
  url "https://registry.npmjs.org/claude-rpc/-/claude-rpc-1.7.1.tgz"
  sha256 "6adee26c3a4ecb9fc98ddbd500d80a63fc1d75fb8961b08e94fe6182842495c4"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/claude-rpc --version")
  end
end
