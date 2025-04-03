**Note:** This document outlines the release process for the Skip Go Widget and associated packages. While the repository is open source, this release process is managed internally by the ICL team.

# Skip Go Widget Release Process

### **Step 1: Sync `staging` to `main`**

- Merge the `staging` branch into `main`.
- This will trigger several GitHub Actions:
    - **Create new releases** for `client` and `widget`.
    - A **"Version Packages" PR** will be opened automatically.
        
        ➤ **Approve and merge** this PR.
        
- After merging the Version Packages PR:
    - GitHub Actions will **publish updated NPM packages** for `client` and `widget`.

---

### **Step 2: Publish Web Component**

- Checkout the `main` branch and pull the latest changes:
    
    ```bash
    git checkout main
    git pull origin main
    
    ```
    
- Navigate to the widget directory and run:
    
    ```bash
    npm run publish:web-component
    
    ```
    

---

### **Step 3: Finalize Release**

- Commit any generated changes .
- Push and **merge the branch into `main`**.
- Approve and merge the **"sync: main to staging"** PR.

---

### **Step 4: Update Web App**

- Switch to the `skip-go-app` repo.
- Pull the latest `main` branch:
    
    ```bash
    
    git pull origin main
    
    ```
    
- In `package.json`, update the versions for:
    - @`skip-go/widget`
    - @`skip-go/client`
- Run npm install
    
    ```bash
    npm install
    
    ```
    
- Commit and push your changes.
- **Merge the update into the `main` branch** of the web app repo.
