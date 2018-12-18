<!-- Change the URL in all samples, use jsDelivr as CDN, mention about XSS -->

# Stein Expedite [![Build Status](https://travis-ci.com/shivensinha4/Stein-Expedite.svg?token=x3fmHcesiyXMyg1SGYVm&branch=master)](https://travis-ci.com/shivensinha4/Stein-Expedite) [![Code Quality Badge](https://api.codacy.com/project/badge/Grade/d632e2064f934c52a513d6d3304a55b0)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=shivensinha4/Stein-Expedite&amp;utm_campaign=Badge_Grade) [![Code Coverage Badge](https://api.codacy.com/project/badge/Coverage/d632e2064f934c52a513d6d3304a55b0)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=shivensinha4/Stein-Expedite&utm_campaign=Badge_Coverage)

Display data from Google Sheets in your website, via handlebars-like `{{ }}` syntax. Or, directly link a form to a Google Sheet.

All straight through your simple, beloved HTML.

## Usage Examples
This section outlines the utility of Expedite for Stein. The usage guide can be found in the table of contents.

Say you have a Google sheet which includes a list of blog posts.

<!-- Insert image here! -->

### Display Posts
Here's the HTML you'd need to display this data.
```html
<div data-stein-url="http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1">
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
<p align="center">
	<img src="https://user-images.githubusercontent.com/19777714/50134649-05239700-02b7-11e9-8cbc-7e0235ecbdab.png" alt="Posts List Demo Screenshot">
</p>

### Add a Post
Simply set the `data-stein-url` attribute of the form. Here's an example of the markup you'd to create an interface to add posts to the Google Sheet.

```html
<form data-stein-url="http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1">
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

<p align="center">
	<img src="https://user-images.githubusercontent.com/19777714/50134707-52a00400-02b7-11e9-81f4-ab5e85f36463.gif" alt="Add Post Demo GIF">
</p>

### Search, Limit, and Offset
You can also directly search the sheet, and limit and offset the results. These can be set via the `data-stein-search`, `data-stein-limit`, and `data-stein-offset` attributes respectively.

##### Full examples can be found in the _examples_ folder

## Installation
Include the script for Expedite before the closing `</body>` tag.
```html
<script src="../index.js"></script>
```

## Documentation
### Read Data from Spreadsheet
1.  Set the `data-stein-url` attribute of the parent element.
2.  Add handlebars `{{ }}` with the column name in any of the child elements.

```html
<div data-stein-url="http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1">
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

#### What happens within the parent element
For each row in the sheet, _the content inside the parent element is cloned and the appropriate values are interpolated_.

### Search Data
You can use the `data-stein-search` attribute to fetch and show only the results which match the given conditions.

Set the `data-stein-search` attribute of the parent to include the conditions in the form of [valid JSON](http://json.org/example.html). Remember to set the attribute within single quotes (`' '`), because JSON keys and string values are set in double quotes (`" "`).

```html
<!-- Filter blog posts by author name -->
<div data-stein-url="http://localhost/storage/5bbf8e7e78625c1890294656/Sheet1" data-stein-search='{"author": "Zat Rana"}'>
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

### Limit and Offset Results
Additionally, you can set the `data-stein-limit` and `data-stein-offset` attributes of the parent (as integers) to limit and offset the results. These attributes can also be used in combination with the search conditions.

```html
<div data-stein-url="..." data-stein-search='{"key": "value"}' data-stein-limit="3" data-stein-offset="1">
	<!-- ... -->
</div>
```

### Save Data to Spreadsheet
1.  Set the `data-stein-url` attribute of the form.
2.  Set the `name` attribute of the input fields to the applicable column name.

```html
<form data-stein-url="...">
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
**Note: To use value interpolations within forms, create a parent element of the form. The `data-stein-url` attribute of forms will not trigger interpolations.**

#### Event on Receiving Response
When the form is submitted and the API response is received, the event _ResponseReceived_ is dispatched on the respective form. The event object has the `detail` property set as 
```json5
{
  status: <INTEGER>,
  body: ...
}
```

You can show success/error messages on respective status codes, or take any other action desired.

<!-- Expedite for Stein helps add Stein super-powers to your website, without the need to play with programming languages and the Stein API. -->
