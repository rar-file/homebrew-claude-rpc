# Homebrew formula for claude-rpc (https://github.com/rar-file/claude-rpc).
#
# url + sha256 are kept on the latest npm release by .github/workflows/bump.yml
# (hourly, or on dispatch from the main repo's release workflow). Edit the rest
# of the formula here by hand; the bump only rewrites those two lines.
class ClaudeRpc < Formula
  desc "Discord Rich Presence for Claude Code: live model, project, tokens and stats"
  homepage "https://claude-rpc.com"
  url "https://registry.npmjs.org/claude-rpc/-/claude-rpc-1.7.2.tgz"
  sha256 "9bf1fa0a6028c9d6d0417747295c91978b2e3093a3dc37ec445c5cee5262a6dd"
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
