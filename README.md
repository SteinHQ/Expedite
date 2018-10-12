<!-- Change the URL in all samples -->

# RestSheet Interpolate

Display data from Google Sheets in your website, via handlebars-like `{{ }}` syntax. Or, directly link a form to a Google Sheet.

All straight through your simple, beloved HTML.

## Examples
This section outlines the utility of Interpolate for RestSheet. The usage guide can be found in the table of contents.

Say you have a Google sheet which includes a list of blog posts.

<!-- Insert image here! -->

### Display posts
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

And you're done! Add a few Bootstrap classes to get a neat result.
![Posts List Demo Screenshot](assets/demo-blog-screenshot.png?raw=true)

### Add a post
Simply set the `data-restsheet-url` attribute of the form. Here's an example of the markup you'd to create an interface to add posts to the Google Sheet.

```html
<form data-restsheet-url="http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1">
    <div class="form-group">
        <label for="title-input">Title</label>
        <input id="title-input" name="title">
      </div>
    <div class="form-group">
        <label for="author-input">Author</label>
        <input type="text" id="author-input" name="author">
    </div>
    <div class="form-group">
        <label for="link-input">Medium Link</label>
        <input type="url" id="link-input" name="link">
    </div>
    <div class="form-group">
        <label for="content-textarea">Content</label>
        <textarea name="content" id="content-textarea" rows="5"></textarea>
    </div>
    <button type="submit">Submit</button>
</form>
```
And there it is again. The submissions will be added to the Google Sheet.

![Add Post Demo Screenshot](assets/demo-form-screenshot.png?raw=true)

### Search, Limit, Offset
You can also directly search the sheet, and limit and offset the results. These can be set via the `data-restsheet-search`, `data-restsheet-limit`, and `data-restsheet-offset` attributes respectively.


##### Full examples can be found in the _examples_ folder.




<!-- Interpolate for RestSheet helps add RestSheet super-powers to your website, without the need to play with programming languages and the RestSheet API. -->
