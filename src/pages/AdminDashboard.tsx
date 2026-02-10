import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCollection, addDocument, updateDocument, deleteDocument, setDocument, useDocument } from "@/hooks/useFirestore";
import { uploadImage } from "@/hooks/useStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PageLoader } from "@/components/LoadingSkeleton";
import { LogOut, Home, LayoutGrid, Tag, CalendarDays, Trash2, Plus, Edit2, Save, X, Image, Phone } from "lucide-react";

type Tab = "home" | "courts" | "offers" | "bookings" | "contact";

const AdminDashboard = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  if (authLoading) return <PageLoader />;
  if (!user) return null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <Home size={18} /> },
    { key: "courts", label: "Courts", icon: <LayoutGrid size={18} /> },
    { key: "offers", label: "Offers", icon: <Tag size={18} /> },
    { key: "bookings", label: "Bookings", icon: <CalendarDays size={18} /> },
    { key: "contact", label: "Contact", icon: <Phone size={18} /> },
  ];

  return (
    <div className="py-24 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-heading font-bold gold-text">Admin Dashboard</h1>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-muted-foreground"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.key)}
              className="gap-2"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8">
          {activeTab === "home" && <HomeManager />}
          {activeTab === "courts" && <CourtsManager />}
          {activeTab === "offers" && <OffersManager />}
          {activeTab === "bookings" && <BookingsManager />}
          {activeTab === "contact" && <ContactManager />}
        </div>
      </div>
    </div>
  );
};

// ==================== HOME MANAGER ====================
function HomeManager() {
  const { data: home, loading } = useDocument<any>("siteContent", "home");
  const { data: features } = useCollection<any>("features", "order");
  const [form, setForm] = useState({ title: "", subtitle: "", ctaText: "", heroImage: "" });
  const [featureForm, setFeatureForm] = useState({ icon: "star", title: "", description: "", order: 0 });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (home) setForm({ title: home.title || "", subtitle: home.subtitle || "", ctaText: home.ctaText || "", heroImage: home.heroImage || "" });
  }, [home]);

  const saveHome = async () => {
    try {
      await setDocument("siteContent", "home", form);
      toast.success("Home content saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, `images/hero-${Date.now()}`);
      setForm((p) => ({ ...p, heroImage: url }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addFeature = async () => {
    if (!featureForm.title) return;
    try {
      await addDocument("features", { ...featureForm, order: features.length });
      setFeatureForm({ icon: "star", title: "", description: "", order: 0 });
      toast.success("Feature added!");
    } catch {
      toast.error("Failed to add feature");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-heading font-semibold text-foreground">Home Content</h2>
      <div className="grid gap-4">
        <Input placeholder="Hero Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="bg-muted border-border" />
        <Input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} className="bg-muted border-border" />
        <Input placeholder="CTA Button Text" value={form.ctaText} onChange={(e) => setForm((p) => ({ ...p, ctaText: e.target.value }))} className="bg-muted border-border" />
        <div className="flex items-center gap-4">
          <Input placeholder="Hero Image URL" value={form.heroImage} onChange={(e) => setForm((p) => ({ ...p, heroImage: e.target.value }))} className="bg-muted border-border flex-1" />
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="h-10 px-4 rounded-md bg-muted border border-border flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Image size={16} /> {uploading ? "Uploading..." : "Upload"}
            </div>
          </label>
        </div>
        <Button onClick={saveHome} variant="hero" className="w-fit"><Save size={16} className="mr-2" />Save Home</Button>
      </div>

      <hr className="border-border" />
      <h2 className="text-xl font-heading font-semibold text-foreground">Features</h2>

      <div className="space-y-3">
        {features.map((f: any) => (
          <div key={f.id} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
            <span className="text-primary text-sm font-mono">{f.icon}</span>
            <span className="flex-1 text-sm">{f.title}</span>
            <Button size="sm" variant="ghost" onClick={() => deleteDocument("features", f.id).then(() => toast.success("Deleted"))}><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select value={featureForm.icon} onChange={(e) => setFeatureForm((p) => ({ ...p, icon: e.target.value }))} className="h-10 px-3 rounded-md bg-muted border border-border text-foreground text-sm">
          <option value="trophy">Trophy</option>
          <option value="users">Users</option>
          <option value="clock">Clock</option>
          <option value="star">Star</option>
        </select>
        <Input placeholder="Title" value={featureForm.title} onChange={(e) => setFeatureForm((p) => ({ ...p, title: e.target.value }))} className="bg-muted border-border" />
        <Input placeholder="Description" value={featureForm.description} onChange={(e) => setFeatureForm((p) => ({ ...p, description: e.target.value }))} className="bg-muted border-border" />
        <Button onClick={addFeature}><Plus size={16} className="mr-1" />Add</Button>
      </div>
    </div>
  );
}

// ==================== COURTS MANAGER ====================
function CourtsManager() {
  const { data: courts } = useCollection<any>("courts", "order");
  const [form, setForm] = useState({ name: "", description: "", image: "", available: true });
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, `images/courts/${Date.now()}`);
      setForm((p) => ({ ...p, image: url }));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name) return;
    try {
      if (editId) {
        await updateDocument("courts", editId, form);
        toast.success("Court updated!");
      } else {
        await addDocument("courts", { ...form, order: courts.length });
        toast.success("Court added!");
      }
      setForm({ name: "", description: "", image: "", available: true });
      setEditId(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const startEdit = (court: any) => {
    setEditId(court.id);
    setForm({ name: court.name, description: court.description, image: court.image || "", available: court.available });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-foreground">
        {editId ? "Edit Court" : "Add Court"}
      </h2>
      <div className="grid gap-4">
        <Input placeholder="Court Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="bg-muted border-border" />
        <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="bg-muted border-border" />
        <div className="flex items-center gap-4">
          <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} className="bg-muted border-border flex-1" />
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="h-10 px-4 rounded-md bg-muted border border-border flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Image size={16} /> {uploading ? "..." : "Upload"}
            </div>
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={form.available} onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))} />
          Available
        </label>
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="hero" className="w-fit">
            <Save size={16} className="mr-2" />{editId ? "Update" : "Add"} Court
          </Button>
          {editId && (
            <Button variant="ghost" onClick={() => { setEditId(null); setForm({ name: "", description: "", image: "", available: true }); }}>
              <X size={16} className="mr-1" />Cancel
            </Button>
          )}
        </div>
      </div>

      <hr className="border-border" />
      <div className="space-y-3">
        {courts.map((c: any) => (
          <div key={c.id} className="flex items-center gap-4 bg-muted/50 rounded-lg p-4">
            {c.image && <img src={c.image} alt={c.name} className="w-16 h-12 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.available ? "Available" : "Booked"}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Edit2 size={14} /></Button>
            <Button size="sm" variant="ghost" onClick={() => deleteDocument("courts", c.id).then(() => toast.success("Deleted"))}><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== OFFERS MANAGER ====================
function OffersManager() {
  const { data: offers } = useCollection<any>("offers", "order");
  const [form, setForm] = useState({ title: "", description: "", badge: "", price: "", features: "" });
  const [editId, setEditId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form.title) return;
    const data = { ...form, features: form.features.split(",").map((f) => f.trim()).filter(Boolean) };
    try {
      if (editId) {
        await updateDocument("offers", editId, data);
        toast.success("Offer updated!");
      } else {
        await addDocument("offers", { ...data, order: offers.length });
        toast.success("Offer added!");
      }
      setForm({ title: "", description: "", badge: "", price: "", features: "" });
      setEditId(null);
    } catch {
      toast.error("Failed to save");
    }
  };

  const startEdit = (o: any) => {
    setEditId(o.id);
    setForm({ title: o.title, description: o.description, badge: o.badge || "", price: o.price || "", features: (o.features || []).join(", ") });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-foreground">{editId ? "Edit Offer" : "Add Offer"}</h2>
      <div className="grid gap-4">
        <Input placeholder="Offer Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="bg-muted border-border" />
        <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="bg-muted border-border" />
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Badge (e.g., 50% OFF)" value={form.badge} onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))} className="bg-muted border-border" />
          <Input placeholder="Price (e.g., 199 EGP)" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="bg-muted border-border" />
        </div>
        <Input placeholder="Features (comma-separated)" value={form.features} onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))} className="bg-muted border-border" />
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="hero" className="w-fit"><Save size={16} className="mr-2" />{editId ? "Update" : "Add"} Offer</Button>
          {editId && <Button variant="ghost" onClick={() => { setEditId(null); setForm({ title: "", description: "", badge: "", price: "", features: "" }); }}><X size={16} className="mr-1" />Cancel</Button>}
        </div>
      </div>
      <hr className="border-border" />
      <div className="space-y-3">
        {offers.map((o: any) => (
          <div key={o.id} className="flex items-center gap-4 bg-muted/50 rounded-lg p-4">
            <div className="flex-1">
              <p className="font-medium text-sm">{o.title}</p>
              {o.badge && <span className="text-xs text-primary">{o.badge}</span>}
            </div>
            <Button size="sm" variant="ghost" onClick={() => startEdit(o)}><Edit2 size={14} /></Button>
            <Button size="sm" variant="ghost" onClick={() => deleteDocument("offers", o.id).then(() => toast.success("Deleted"))}><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== BOOKINGS MANAGER ====================
function BookingsManager() {
  const { data: bookings } = useCollection<any>("bookings");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-foreground">Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Phone</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Court</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-b border-border/50">
                  <td className="py-3 pr-4">{b.name}</td>
                  <td className="py-3 pr-4">{b.phone}</td>
                  <td className="py-3 pr-4">{b.date}</td>
                  <td className="py-3 pr-4">{b.time}</td>
                  <td className="py-3 pr-4">{b.court}</td>
                  <td className="py-3">
                    <Button size="sm" variant="ghost" onClick={() => deleteDocument("bookings", b.id).then(() => toast.success("Deleted"))}><Trash2 size={14} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

// ==================== CONTACT MANAGER ====================
function ContactManager() {
  const { data: contact } = useDocument<any>("siteContent", "contact");
  const [form, setForm] = useState({ whatsapp: "", phone: "", location: "", mapEmbed: "" });

  useEffect(() => {
    if (contact) setForm({
      whatsapp: contact.whatsapp || "",
      phone: contact.phone || "",
      location: contact.location || "",
      mapEmbed: contact.mapEmbed || ""
    });
  }, [contact]);

  const saveContact = async () => {
    try {
      await setDocument("siteContent", "contact", form);
      toast.success("Contact info saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-semibold text-foreground">Contact Information</h2>
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">WhatsApp Number</label>
          <Input placeholder="e.g. 01xxxxxxxxx" value={form.whatsapp} onChange={(e) => setForm(p => ({ ...p, whatsapp: e.target.value }))} className="bg-muted border-border" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input placeholder="e.g. 01xxxxxxxxx" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-muted border-border" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location Name</label>
          <Input placeholder="e.g. VIP PADEL Club" value={form.location} onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))} className="bg-muted border-border" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Google Maps Embed URL</label>
          <Input placeholder="https://www.google.com/maps/embed?..." value={form.mapEmbed} onChange={(e) => setForm(p => ({ ...p, mapEmbed: e.target.value }))} className="bg-muted border-border" />
          <p className="text-xs text-muted-foreground">Paste the 'src' URL from the Google Maps iframe code.</p>
        </div>
        <Button onClick={saveContact} variant="hero" className="w-fit"><Save size={16} className="mr-2" />Save Contact Info</Button>
      </div>
    </div>
  );
}
