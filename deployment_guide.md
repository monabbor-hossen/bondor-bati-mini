# 🚀 Hostinger Deployment Guide

I've prepared everything you need to deploy your project to `catering.mbhgoldenglobal.com`. 

I have automatically exported your local database and bundled it along with your entire project into a zip file on your computer.

📦 **Your Deployment Zip File:** `C:\xampp\htdocs\bondor-bati-site\bondor_bati_deploy.zip`
(This zip contains all your PHP files, images, CSS, and a file called `database.sql` which holds all your local data.)

Here is how to deploy it using Hostinger's SSH support!

---

## Step 1: Upload the Project via SSH (SCP)

Since you have SSH support, you can upload the zip file directly from your computer's terminal (Command Prompt/PowerShell) to your Hostinger server.

1. **Find your SSH credentials** in Hostinger:
   - Go to your hPanel → **Advanced** → **SSH Access**.
   - Note down the **SSH IP**, **Port** (usually 65002), **Username** (e.g., `u123456789`), and **Password**.

2. **Open Command Prompt or PowerShell** on your Windows PC and run the following command to upload the zip:
   ```bash
   scp -P 65002 C:\xampp\htdocs\bondor-bati-site\bondor_bati_deploy.zip u123456789@YOUR_SSH_IP:domains/catering.mbhgoldenglobal.com/public_html/
   ```
   *(Make sure to replace `65002` with your actual port, `u123456789` with your SSH username, and `YOUR_SSH_IP` with your actual Hostinger IP).*

3. **SSH into your server** to unzip it:
   ```bash
   ssh -p 65002 u123456789@YOUR_SSH_IP
   ```
4. **Unzip the files and clean up:**
   ```bash
   cd domains/catering.mbhgoldenglobal.com/public_html
   
   # Unzip the uploaded file
   unzip bondor_bati_deploy.zip
   
   # Remove the zip file to save space
   rm bondor_bati_deploy.zip
   ```

*(Alternative: If you prefer the visual way, you can just log into Hostinger hPanel, go to File Manager, open `public_html`, click "Upload", select the `bondor_bati_deploy.zip`, and click "Extract").*

---

## Step 2: Set Up the Database

1. In your Hostinger hPanel, go to **Databases** → **Management**.
2. Create a new MySQL Database.
   - **Database name:** `catering_db` (or whatever you prefer)
   - **Username:** `catering_user`
   - **Password:** Create a strong password
3. Click **Enter phpMyAdmin** next to your new database.
4. Click the **Import** tab at the top.
5. Click **Choose File** and select the `database.sql` file you uploaded (you can download it from your Hostinger File Manager to your PC first if you haven't, or you can import it directly via SSH).

**To import via SSH (Faster):**
If you are still logged into SSH from Step 1, run:
```bash
mysql -u catering_user -p catering_db < database.sql
```
*(It will ask for the database password you just created).*

---

## Step 3: Configure Environment Variables

Your site needs to know how to connect to the new Hostinger database.

1. Still in SSH (or via the File Manager), rename your `.env.example` file to `.env` (or just edit the existing `.env` file):
   ```bash
   nano .env
   ```
2. Update the database credentials to match the ones you created in Step 2:

   ```ini
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://catering.mbhgoldenglobal.com
   APP_TIMEZONE=Asia/Dhaka
   
   # Update these with your Hostinger database details!
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=u123456789_catering_db
   DB_USERNAME=u123456789_catering_user
   DB_PASSWORD=YourStrongDatabasePassword123
   ```
3. Save the file (`Ctrl + O`, `Enter`, then `Ctrl + X` if using nano).

---

## Step 4: Final Security Checks 🔒

1. Delete the `database.sql` file from your server so nobody can download it!
   ```bash
   rm database.sql
   ```
2. Ensure SSL is enabled in Hostinger (hPanel → Security → SSL).
3. Visit `https://catering.mbhgoldenglobal.com` and `https://catering.mbhgoldenglobal.com/admin/index.php` to ensure everything is working smoothly!
