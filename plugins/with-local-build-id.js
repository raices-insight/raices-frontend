const { withAppBuildGradle } = require('@expo/config-plugins');

const INJECTION_MARKER = 'raices.localBuild';

const SUFFIX_BLOCK = `
            if ((findProperty('raices.localBuild') ?: 'false').toBoolean()) {
                applicationIdSuffix '.local'
            }`;

function injectLocalBuildSuffix(contents) {
  if (contents.includes(INJECTION_MARKER)) {
    return contents;
  }

  const anchor = /(release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.debug\b)/;
  if (!anchor.test(contents)) {
    throw new Error(
      "withLocalBuildId: couldn't find `release { ... signingConfig signingConfigs.debug }` in android/app/build.gradle. The plugin's anchor needs updating."
    );
  }
  return contents.replace(anchor, `$1\n${SUFFIX_BLOCK}`);
}

module.exports = function withLocalBuildId(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error('withLocalBuildId only supports Groovy build.gradle');
    }
    cfg.modResults.contents = injectLocalBuildSuffix(cfg.modResults.contents);
    return cfg;
  });
};

module.exports.injectLocalBuildSuffix = injectLocalBuildSuffix;
