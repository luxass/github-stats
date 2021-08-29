<p align="center">
 <img width="150px" src="docs/logo.svg" align="center" alt="GitHub Stats" />

 <h2 align="center">GitHub Stats</h2>
 <p align="center">Get dynamically generated GitHub stats on your readmes!</p>
</p>

  <p align="center">
    <a href="https://github.com/deprecatedluxas/github-stats/issues/new/choose">Report Bug</a>
    -
    <a href="https://github.com/deprecatedluxas/github-stats/issues/new/choose">Request Feature</a>
  </p>
  
</p>

## Contents

-   [Usage](#usage)
    -   [Stats Card](#stats-card)
    -   [Repo Card](#repo-card)
-   [Themes](#themes)
-   [Customization](#customization)
    -   [Common Options](#common-options)
    -   [Stats Card Exclusive Options](#exclusive-options-to-stats-card)
    -   [Repo Card Exclusive Options](#exclusive-options-to-repo-card)
-   [How to contribute](#how-to-contribute)

## Usage

### Stats Card

Copy the following code into your readme file and change the `username` to match your GitHub username.


```md
[![DeprecatedLuxas' GitHub stats](https://github-stats.vercel.app/api/user/username)](https://github.com/deprecatedluxas/github-stats)
```
#### Want to hide the icons?

We got you covered! You can pass `hide_icons=true` as a query parameter to hide the icons.

```md
[![DeprecatedLuxas' GitHub stats](https://github-stats.vercel.app/api/user/username?hide_icons=true)](https://github.com/deprecatedluxas/github-stats)
```

### Repo Card

Copy the following code into your readme file and change the `username` to match your GitHub username and `reponame` to match your repository name.


```md
[![DeprecatedLuxas' GitHub stats](https://github-stats.vercel.app/api/user/username/repo/reponame)](https://github.com/deprecatedluxas/github-stats)
```
#### Want to hide the owner?

We got you covered! You can pass `hide_owner=true` as a query parameter to hide the owner.

```md
[![DeprecatedLuxas' GitHub stats](https://github-stats.vercel.app/api/user/deprecatedluxas?hide_owner=true)](https://github.com/deprecatedluxas/github-stats)
```

## Themes

With our inbuilt themes, you can customize the look of the without doing any additional [customization](#customization).

Use the `?tq=THEME_IDENTIFIER` as a parameter to choose a theme.

```md
![Deprecatedluxas's GitHub stats](https://github-stats.vercel.app/api/user/deprecatedluxas?tq=THEME_DRACULA)
```


### Inbuilt Themes

You can preview all the themes right [here](./themes/README.md) or you can check out the theme files [here](./themes/).

> Note: You can at any time contribute your own theme.

## Customization

You can customize the appearance of your `Stats Card` or `Repo Card` however you wish with URL parameters.

#### Common Options:

-   `title` - Card's title color _(hex color)_
-   `text` - Body text color _(hex color)_
-   `icon` - Icons color if available _(hex color)_
-   `border` - Card's border color _(hex color)_
-   `background` - Card's background color _(hex color)_
-   `tq` - identifier of the theme, choose from [all available themes](./themes/README.md)

> Note on _hex color_: Write the hex color without the #, because the # is used as a hash in the URL.


#### Exclusive Options to Stats Card:

-   `custom_title` - Sets a custom title for the card
-   `hide_icons` - Hides the icons _(boolean)_

#### Exclusive Options to Repo Card:

-   `hide_owner` - Hides the repo's owner name _(boolean)_


## How to contribute

Have an idea? Found a bug? See [how to contribute](CONTRIBUTING.md)

## :purple_heart: Support the project

This project is 100% free and open source. If you like it, please consider supporting the project, there are a few ways you can do so:

-   Starring and sharing the project
-   Report any bugs, glitches or errors that you find

## Related Projects

-   Inspired by a desire to improve upon
    [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)
-   Makes use of [GitHub Octicons](https://primer.style/octicons/) to precisely
    match the GitHub UI

## :scroll: License

[MIT](LICENSE) © Lucas Norgaard
