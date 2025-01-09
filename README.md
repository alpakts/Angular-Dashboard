
# **Angular Product Management Application**

This project is an Angular-based application that provides features like product management, user management, and shift management. Below is the list of implemented features, project structure, and technical details.

---

## **Features**

### **1. Product Inventory**
- **Product Listing:**
  - Displays product details such as name, category, price, stock level, and reorder point.
- **Filtering and Sorting:** 
  - Filter products by category, stock level, price range.
  - Sorted view of all products.
- **Search Functionality:**
  - Quickly search for products by name.
- **Low Stock Alerts:**
  - Highlights products with low stock,expired visually.
- **CSV Export:** 
  - Export the product list as a CSV file.
- **Expiry Date Tracking:**
  - Visual alerts for products nearing their expiry or already expired.

---

### **2. Product Management**
- **CRUD Operations:**
  - Add, edit, delete, and update product details.
- **Stock Management:**
  - Adjust stock levels based on sales or replenishments.
- **Expiry Date Validation:**
  - Validates date formats and ensures minimum validity.
- **Role-Based Authorization:**
  - Restricts CRUD operations to authorized users.

---

### **3. User Management**
- **User CRUD Operations:**
  - Add, edit, and delete users.
- **Role-Based Authorization:**
  - Users are assigned roles such as Admin, Manager, or Staff:
    - **Admin:** Full access to all features.
    - **Manager:** Can manage products but cannot access user management.
    - **Staff:** Can only view products.
- **Authentication & Authorization:** 
  - User login system with role-based permissions.

---

### **4. Dashboard**
- **Key Metrics:**
  - Displays low-stock products, expired products, and daily sales metrics.
- **Sales Trends:**
  - Visualizes sales trends with a chart component.
---

### **5. Shift Management**
- **Shift Calendar:**
  - Weekly view of user work schedules.
- **Shift CRUD Operations:**
  - Add, edit, and delete shifts.
- **Filter & Date Range Selection:**
  - Filter shifts by specific date ranges.
- **Edit with Modal:**
  - Edit shifts by clicking on a specific day, opening a modal for adjustments.
---

### **6. Logs View**
- **Pagination and Filtering**:
   - Logs are displayed in a paginated table
   - Filters can be applied based on specific criteria (e.g., action type or date range).
- **Old Log Cleanup**:
   - A feature to remove logs older than a specified number of days is implemented in the log service.
- **Integration with Other Components**:
   - Logging is integrated with the product service to capture key actions (e.g., adding a product logs an "Add" activity).
---

### **7. Technical Details**
- **Angular Standalone Components:**
  - Developed using Angular's standalone component architecture.
- **State Management:**
  - Managed using RxJS and BehaviorSubject.
- **IndexedDB Integration:**
  - All data is stored and managed using IndexedDB.
- **Reusable Components:**
  - Generic components like Modal and Table for reusability.
- **Angular Material UI:**
  - The application is styled using Angular Material components.
- **Custom Pipes and Directives:**
  - Includes custom pipes for stock level and date calculations.
- **Unit Testing:**
  - Test setup is ready; test cases can be extended further.

---

## **File Structure**

```plaintext
src/
│
├── app/
│   ├── auth/                # Authentication & Authorization
│   ├── core/                # layout
│   ├── products/            # Product Management
│   ├── dashboard/           # Dashboard
│   ├── shift-management/    # Shift Management
│   ├── logs/                # Activity Logs
│   └── shared/              # Shared Components & Utilities
```

---

## **Setup and Run**

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Application:**
   ```bash
   npm start
   ```

3. **Open in Browser:**
   ```
   http://localhost:4200
   ```
4. **User Credentials Can be Found at src/app/shared/services/initial-user-data.json

---

## **Notes**
- **Angular Material Theme:** Material components are styled with active theme support.
- **Feature Based Structure:** Organized by specific features such as Product, User, and Shift management for better scalability.
---
