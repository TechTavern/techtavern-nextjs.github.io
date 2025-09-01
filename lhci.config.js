/**
 * Lighthouse CI configuration for Tech Tavern static site.
 * - Collect audits against a local static server serving `out/`.
 * - Assert minimum accessibility score.
 * - Upload reports to filesystem for GitHub Actions artifacts.
 */

/** @type {import('@lhci/cli').LHCI.Config} */
module.exports = {
  ci: {
    collect: {
      // We start a static server ourselves in CI; LHCI just needs the URLs.
      startServerCommand: null,
      numberOfRuns: 1,
      settings: {
        // Use default form factor; accessibility category is form-factor agnostic.
        locale: 'en-US',
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci-report',
      reportFilenamePattern: 'lhr-%%path%%-%%datetime%%.json',
    },
  },
};

