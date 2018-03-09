//https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
const path = require('path');

module.exports = {
	lintOnSave: false,
	dll: true,
	chainWebpack: (config) => {
		config.externals.systemConfig = 'systemConfig';
		config.resolve.alias['assets'] = path.resolve(__dirname, '../src/assets');
	},
	configureWebpack: {},
};
