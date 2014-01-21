var RSS = require('rss'),
	url = require('url');

module.exports = function(rufio) {

	// Require the plugin config
	rufio.config.validate('rss', function(val, done) {
		var err;
		if (typeof val === 'undefined' || val === null) {
			err = 'Rss config is required.  It seems to be missing.';
		}

		if (typeof val.feeds === 'undefined' || val.feeds === null) {
			err = [
				'The rss plugin requires a list of feeds to create. It should look like this:',
				'"rss": {',
					'\t"rss.xml": {',
						'\t"types": ["post", "page"]',
					'\t}',
				'}',
			].join('\n');
		}

		done(err);
	});

	// Hook in after the build to write the rss feed
	rufio.hooks.on('afterBuild', function(rufio, done) {

		var feeds = rufio.config.get('rss.feeds');

		// Keep track of the complete feeds
		// to tell when to call the done function
		var feedsComplete = 0;

		// Loop through the feeds and write the files
		for (var feedPath in feeds) {
			// Create the feed
			var feed = new RSS({
				// Rufio Generator
				generator: 'Rufio ' + rufio.config.get('RUFIO_VERSION'),

				// Feed info
				feed_url: url.format({
					protocol: rufio.config.get('protocol') || 'http',
					host: rufio.config.get('hostname'),
					pathname: feedPath
				}),
				// Either the feed image or the main rss image
				image_url: feeds[feedPath].image || rufio.config.get('rss.image'),
				pubDate: Date.now(),

				// General site info
				title: rufio.config.get('title'),
				site_url: url.format({
					protocol: rufio.config.get('protocol') || 'http',
					host: config.get('hostname')
				}),
				description: rufio.config.get('description'),
				author: rufio.config.get('author')
			});

			// Loop through types and items
			for (var t in feeds[feedPath].types) {
				// Get the type key
				var type = feeds[feedPath].types[t];

				// Loop through the items in that type
				for (var i in rufio.data[type].items) {
					var item = rufio.data[type].items[i];
					if (item.meta.status == 'Published') {
						feed.item({
							title: item.meta.title,
							description: item.meta.description || item.content,
							url: item.meta.absUrl,
							author: item.meta.author || rufio.config.get('author'),
							date: item.meta.date
						});
					}
				}
			}

			// Write the file
			rufio.util.writeFile(path.join(rufio.config.get('BUILD_ROOT'), rufio.config.get('BUILD_VERSION'), feedPath), feed.xml(), function(err) {
				if (err) {
					console.error(err);
				}

				// Track the complete feeds and call done
				feedsComplete++;
				if (feedsComplete == rufio.util._.size(feeds)) {
					done();
				}
			});

		}
	});

};

