# Routaa Shared Components

This library based on the world's most popular frameworks and libraries - bootstrap v5, vue v3, vite v4, tinymce v5, i18n v9 And typescript
and uses for routaa projects based on vue 3,
with more than 30 component and several directives.

## Quick start

Clone the repo: `http://192.168.7.152/matin/routaa/modules/front/routaa-shared-components.git`

Install with [npm](https://www.npmjs.com/) `npm install @routaa/routaa-shared-components@v1.0.0`

### Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run serve
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Use Project

For use project you can import a component like this:

For Example : 

```sh
import {ActionButtons} from '@routaa/routaa-shared-components'
import {AutoComplete} from '@routaa/routaa-shared-components'
```

## Required imports
In your **style.scss**, you’ll import ColorPicker’s source Css files.
### Color Picker Imports

```sh
import 'vue3-colorpicker/style.css'
```
And in your **main.js**, you’ll import Tinymce’s source theme and plugins files.
### Tiny Mce Imports

```sh
import 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/link'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/code'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/searchreplace'
import 'tinymce/icons/default'
```
