@echo off
cd /d "D:\Fionka_web"

echo STEP 1/4: Login to Cloudflare
echo A browser will open - log in to your Cloudflare account
pause
npx wrangler login
echo Press any key when login is done...
pause
cls

echo STEP 2/4: Create D1 database
npx wrangler d1 create fionka-db
echo.
echo Copy the database_id shown above^!
echo Then open wrangler.toml and paste it in: database_id = "..."
echo Press any key after updating wrangler.toml...
pause
cls

echo STEP 3/4: Run database schema
npx wrangler d1 execute fionka-db --file=./schema.sql
pause
cls

echo STEP 4/4: Deploy to Cloudflare Pages
npx wrangler pages deploy . --project-name fionka
echo.
echo DONE! The URL is shown above.
pause
