# B2B Marketplace Project Documentation (IndiaMart Clone)

Is document mein humne bataya hai ki kaise ek Multi-Vendor B2B Marketplace banaya jaye jisme **Supabase** backend ka kaam karega aur WhatsApp integration se sales queries handle hongi.

## 1. Project Overview
- **Roles**: Admin, Seller, Buyer.
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **Core Logic**: Row Level Security (RLS) ka use karke sellers ko sirf unka apna data dikhana.
- **Primary Action**: WhatsApp-based Inquiry system.

---

## 2. Database Schema (Supabase Tables)

Supabase ke SQL Editor mein niche di gayi tables banani hongi:

### A. Profiles Table
Isme users ki details aur unka role save hoga.
```sql
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  role text check (role in ('admin', 'seller', 'buyer')),
  whatsapp_number text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

### B. Products Table
Sellers apne products yaha list karenge.
```sql
create table products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references profiles(id) not null,
  name text not null,
  description text,
  price decimal,
  category text,
  image_url text,
  is_approved boolean default false, -- Admin approval ke liye
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

---

## 3. Row Level Security (RLS) Logic
Ye aapki sabse badi condition hai: **"Seller sirf apna data dekhe"**.

1. **Products Table par RLS Enable karein.**
2. **Policy for Sellers**:
   - `SELECT`: `auth.uid() = seller_id` (Seller sirf apna product dekhe dashboard mein).
   - `INSERT`: `auth.uid() = seller_id` (Seller sirf apne naam se product add kare).
3. **Policy for Buyers**:
   - `SELECT`: `is_approved = true` (Buyer sirf wo products dekhe jo admin ne approve kiye hain).

---

## 4. Frontend Structure (Pages)

Aapko niche di gayi main pages banani hongi:

| Page | Access | Functionality |
| :--- | :--- | :--- |
| **Home / Catalog** | Everyone | Saare approved products dikhana. |
| **Login/Signup** | Everyone | Role select karke (Buyer/Seller) register karna. |
| **Seller Dashboard** | Seller Only | Sirf apne products ki list dekhna aur naye products add karna. |
| **Product Detail** | Everyone | Product ki details aur "Buy on WhatsApp" button. |
| **Admin Panel** | Admin Only | Pending products ko approve karna aur users manage karna. |

---

## 5. WhatsApp Integration Logic

Har product page par ek button hoga. Iska logic ye hoga:

**Constructing the Link:**
```javascript
const phoneNumber = "91XXXXXXXXXX"; // Aapka Business Number
const message = `Halo Admin, mujhe ye product pasand hai:
Product: ${product.name}
Price: ${product.price}
Link: ${window.location.href}`;

const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
```
Jab buyer click karega, ye details seedhe aapke WhatsApp par aa jayengi.

---

## 6. Implementation Steps (Step-by-Step)

### Step 1: Supabase Setup
- Supabase pe project banayein.
- SQL Editor mein Tables aur RLS Policies run karein.
- Auth settings mein "Email Confirmation" manage karein.

### Step 2: Auth Implementation
- Login/Signup form banayein.
- Signup ke waqt `profiles` table mein `role` (Buyer ya Seller) insert karein.

### Step 3: Product Listing (Seller Side)
- Ek form banayein jaha seller product ka Name, Price, aur Description dale.
- **Image Upload**: Supabase Storage bucket banayein ('product-images'). Image upload karke uska public URL `products` table mein save karein.

### Step 4: Buyer Catalog (Buyer Side)
- Home page par `supabase.from('products').select('*').eq('is_approved', true)` run karein.
- Grid layout mein products dikhayein.

### Step 5: WhatsApp Action
- Product detail page par WhatsApp link generator function lagayein.

### Step 6: Admin Approval (Security)
- Admin dashboard banayein jaha `is_approved = false` wale products dikhein.
- Button click par `is_approved` ko `true` update kar dein.

---

## 7. Scalability & Future Updates
- **Search**: Supabase full-text search enable karein.
- **Filter**: Category-wise filtering lagayein.
- **Notifications**: Jab naya seller register ho, admin ko email jaye.
