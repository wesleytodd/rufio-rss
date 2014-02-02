# RSS feeds for Rufio

Install the plugin:

	$ npm install --save rufio-rss

Then add `rss` to your enabled plugins in your projects `rufio.json` file and configure the plugin:

```
	"plugins": {
		"active": [
			"rss"
		]
	},
	"rss": {
		"feeds": {
			"rss.xml": {
				"types": ["page", "post"]
			}
		}
	}
```

This will create a file, `rss.xml` in the root of your build.  The rss feed will include both page and post types.
