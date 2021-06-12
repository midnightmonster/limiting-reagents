# Limiting Reagant Simulator

## License

Free to use and adapt under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Also, feel free to read and borrow any techniques that are useful. If you for some reason have some commercial use for this, get in touch. 

## Developing

Install the dependencies...

```bash
git clone git@github.com:midnightmonster/limiting-reagents.git
cd limiting-reagents
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the app running.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) I recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Production build, run, deploy

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in the package.json's `dependencies` so that the app will work if you deploy to platforms like [Heroku](https://heroku.com).

## Deploy

You can **deploy to netlify** by just dragging the `public` folder into a netlify deploy drop zone after a build.

## More deployment options (suggestions from Svelte template, haven't tried)

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
