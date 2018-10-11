# RestSheet Interpolate

Display data from Google Sheets in your website, via handlebars-like `{{ }}` syntax. Or, directly link a form to a Google Sheet.

All straight through the simple, beloved HTML.

## Example
This section outlines the utility of Interpolate for RestSheet. The usage guide can be found in the table of contents.

Say you have a Google sheet which includes a list of blog posts.

<!-- Insert image here! -->

#### Display posts
Here's the HTML you'd need to display this data.
```html
<div data-restsheet-url="http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1">
    <div>
        <h1>{{title}}</h1>
        <h6>By {{author}}</h6>
        <p>
            {{content}}
        </p>
        <p>
            Read on <a href="{{link}}">Medium</a>
        </p>
    </div>
</div>
```

And you're done! Add a bit of styling to get a neat result.
![Blog Demo Screenshot](./assets/demo-blog-screenshot.png)

#### Add a post




<!-- Interpolate for RestSheet helps add RestSheet super-powers to your website, without the need to play with programming languages and the RestSheet API. -->
