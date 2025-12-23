# Deployment Guide

## Quick Start

The Prompt Improver app is a static single-page application that can be deployed to any static hosting service.

## Build for Production

```bash
npm run build
```

This creates optimized production files in the `dist/` directory.

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

**Configuration**: No special configuration needed - Vercel auto-detects Vite projects.

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Configuration**: Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts` with base path:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
});
```

4. Deploy:
```bash
npm run deploy
```

### Option 4: Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize:
```bash
firebase init hosting
```

3. Configure `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. Deploy:
```bash
npm run build
firebase deploy
```

### Option 5: AWS S3 + CloudFront

1. Build the app:
```bash
npm run build
```

2. Create an S3 bucket and enable static website hosting

3. Upload the `dist/` folder contents to S3:
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. Create a CloudFront distribution pointing to the S3 bucket

5. Set error page to redirect to `index.html` for SPA routing

### Option 6: Digital Ocean App Platform

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

## Environment Variables

### API Key Configuration

The app stores the Gemini API key in the browser's localStorage. No environment variables are needed at build time.

**For enterprise deployments** where you want to provide a default API key:

You can modify `App.tsx` to check for a build-time environment variable:

```typescript
const defaultApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
```

Then set it during build:
```bash
VITE_GEMINI_API_KEY=your-key-here npm run build
```

**Security Note**: Only do this for private deployments. Never commit API keys to version control.

## Custom Domain

After deploying to any platform:

1. Add a custom domain in your hosting provider's dashboard
2. Update your DNS records to point to the hosting provider
3. Enable HTTPS (usually automatic)

## Performance Tips

### Enable Compression
Most hosting platforms enable gzip/brotli automatically. If self-hosting:
- Enable gzip compression on your server
- The app is already optimized and minified

### CDN Configuration
- Tailwind CSS is loaded from CDN (fast, cached)
- Static assets are in the `assets/` folder
- Set appropriate cache headers (1 year for assets, short for index.html)

### Monitoring
Consider adding:
- Google Analytics for usage tracking
- Sentry for error monitoring
- Vercel Analytics (if using Vercel)

## Post-Deployment Checklist

✅ App loads without errors  
✅ API key input works  
✅ Prompt analysis functions correctly  
✅ Voice recording works (requires HTTPS)  
✅ History saves and loads  
✅ Images generate (if supported)  
✅ Toast notifications appear  
✅ Mobile responsive design works  
✅ All buttons and interactions function  
✅ Copy to clipboard works (requires HTTPS)  

## Troubleshooting

### Voice Recording Not Working
- Ensure the app is served over HTTPS
- Check browser permissions for microphone access
- MediaRecorder API requires a secure context

### API Key Issues
- Verify the Gemini API key is valid
- Check browser console for error messages
- Ensure localStorage is enabled in the browser

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Verify Node.js version (18+ recommended)

### 404 on Routes (SPAs)
- Ensure your hosting platform redirects all routes to `/index.html`
- This is critical for single-page applications

## Updating the App

```bash
git pull origin main
npm install  # If dependencies changed
npm run build
# Deploy using your chosen method
```

## Support

For issues or questions:
- Check the GitHub Issues page
- Review the FEATURES.md file
- Consult the README.md for basic usage

## License

MIT License - Free to use and deploy anywhere.
