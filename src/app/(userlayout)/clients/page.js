"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  FolderOpen,
  Plus,
  Users,
  Sparkles,
  Building2,
  Star,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function ClientsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(Array.isArray(data) ? data : []);
  };

  const handleAddClient = async () => {
    const method = isEditMode ? "PUT" : "POST";
    const endpoint = isEditMode
      ? `/api/clients/${editClientId}`
      : "/api/clients";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({ name: "", email: "", phone: "", address: "" });
      setShowForm(false);
      setIsEditMode(false);
      setEditClientId(null);
      fetchClients();
    }
  };

  const handleEdit = (client) => {
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setEditClientId(client.id);
    setIsEditMode(true);
    setShowForm(true);
  };
  
  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      const res = await fetch(`/api/clients/${clientToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchClients();
        setDeleteDialogOpen(false);
        setClientToDelete(null);
      } else {
        console.error("Failed to delete client.");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const getClientIcon = (index) => {
    const icons = [Building2, Users, Star, Shield, TrendingUp];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-5 h-5 text-white" />;
  };

  return (
    <div className="min-h-screen relative z-10 max-w-7xl mx-auto px-4 mt-16">
        
      {/* Top Navigation */}
      <div className="relative z-10 flex items-center mb-2 px-6 pt-6">
        <div className="flex gap-1 bg-white/80 backdrop-blur-xl rounded-2xl p-1.5 shadow-2xl border border-white/30">
          <Button
            variant="ghost"
            onClick={() => router.push("/clients")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 hover:scale-105 flex items-center gap-2 ${
              pathname === "/clients"
                ? "bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-lg shadow-[#0F4C75]/30"
                : "text-[#1E293B] hover:bg-white/60"
            }`}
          >
            <Users className="w-4 h-4" />
            Clients
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/Projects")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 hover:scale-105 flex items-center gap-2 ${
              pathname === "/Projects"
                ? "bg-gradient-to-r from-[#0F4C75] to-[#3282B8] text-white shadow-lg shadow-[#0F4C75]/30"
                : "text-[#1E293B] hover:bg-white/60"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            All Projects
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-3xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#0F4C75] via-[#3282B8] to-[#0891B2] p-8 relative overflow-hidden rounded-t-3xl -mt-6">
            <div className="relative flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Clients
                  </h1>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  setShowForm(true);
                  setIsEditMode(false);
                  setFormData({ name: "", email: "", phone: "", address: "" });
                }}
                className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-110 bg-white text-[#0F4C75] border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Add New Client
              </Button>
            </div>
          </div>

          {/* Client List */}
          <div className="p-8 space-y-6">
            {clients.map((client, index) => (
              <Card
                key={client.id}
                className="group relative overflow-hidden backdrop-blur-xl bg-white/10 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl"
                style={{
                  borderLeft: `6px solid ${
                    index % 3 === 0 ? '#0891B2' : 
                    index % 3 === 1 ? '#3282B8' : '#0F4C75'
                  }`,
                }}
              >
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0891B2]/5 to-[#0F4C75]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${
                            index % 3 === 0 ? '#0891B2, #0F4C75' : 
                            index % 3 === 1 ? '#3282B8, #0F4C75' : '#0F4C75, #3282B8'
                          })`,
                        }}
                      >
                        {getClientIcon(index)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#0F4C75] mb-1 group-hover:text-[#0891B2] transition-colors duration-300">
                          {client.name}
                        </h2>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="p-3 rounded-xl transition-all duration-300 hover:scale-125 bg-gradient-to-r from-[#0891B2]/10 to-[#3282B8]/10 hover:from-[#0891B2]/20 hover:to-[#3282B8]/20 text-[#0F4C75] border border-[#0891B2]/20 shadow-md hover:shadow-lg"
                        onClick={() => handleEdit(client)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="p-3 rounded-xl transition-all duration-300 hover:scale-125 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-600 border border-red-200 shadow-md hover:shadow-lg"
                        onClick={() => {
                          setClientToDelete(client);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Contact Information Grid */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="group/item p-4 rounded-xl bg-gradient-to-br from-[#0891B2]/5 to-[#0F4C75]/5 border border-[#0891B2]/20 hover:border-[#0891B2]/40 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-[#0891B2] to-[#3282B8] shadow-lg group-hover/item:shadow-xl transition-shadow duration-300">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0F4C75] uppercase tracking-wider">Email</p>
                          <p className="text-sm font-semibold text-[#1E293B] group-hover/item:text-[#0891B2] transition-colors duration-300">
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group/item p-4 rounded-xl bg-gradient-to-br from-[#3282B8]/5 to-[#0891B2]/5 border border-[#3282B8]/20 hover:border-[#3282B8]/40 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-[#3282B8] to-[#0891B2] shadow-lg group-hover/item:shadow-xl transition-shadow duration-300">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0F4C75] uppercase tracking-wider">Phone</p>
                          <p className="text-sm font-semibold text-[#1E293B] group-hover/item:text-[#3282B8] transition-colors duration-300">
                            {client.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group/item p-4 rounded-xl bg-gradient-to-br from-[#0F4C75]/5 to-[#3282B8]/5 border border-[#0F4C75]/20 hover:border-[#0F4C75]/40 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-[#0F4C75] to-[#3282B8] shadow-lg group-hover/item:shadow-xl transition-shadow duration-300">
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0F4C75] uppercase tracking-wider">Address</p>
                          <p className="text-sm font-semibold text-[#1E293B] group-hover/item:text-[#0F4C75] transition-colors duration-300">
                            {client.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Projects Section */}
                  {client.projects?.length > 0 && (
                    <div className="border-t border-[#0891B2]/10 pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-[#0891B2] to-[#0F4C75] shadow-md">
                          <FolderOpen className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F4C75]">
                          Projects ({client.projects.length})
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {client.projects.map((p, projectIndex) => (
                          <div
                            key={p.project.id}
                            className="group/project relative overflow-hidden px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer"
                            style={{
                              background: `linear-gradient(135deg, ${
                                projectIndex % 3 === 0 ? '#0891B2, #0F4C75' : 
                                projectIndex % 3 === 1 ? '#3282B8, #0891B2' : '#0F4C75, #3282B8'
                              })`,
                              color: 'white',
                            }}
                          >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/project:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10 flex items-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              {p.project.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Add/Edit Client Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl max-w-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0891B2]/5 to-[#0F4C75]/5"></div>
          
          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#0891B2] to-[#0F4C75] shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-[#0F4C75]">
                {isEditMode ? "Edit Client" : "Add New Client"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="relative space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
                Client Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
                placeholder="Enter client name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
                Email Address
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-bold text-[#0F4C75] uppercase tracking-wider">
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border-2 border-[#0891B2]/20 focus:border-[#0891B2] rounded-xl p-4 bg-gradient-to-r from-[#F0F9FF] to-white transition-all duration-300 focus:shadow-lg text-[#1E293B] placeholder-[#1E293B]/50"
                placeholder="Enter address"
              />
            </div>
          </div>

          <DialogFooter className="relative gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)} 
              className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-white border-2 border-[#1E293B]/20 text-[#1E293B] hover:bg-[#1E293B]/5"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddClient} 
              className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#0891B2] to-[#0F4C75] text-white border-0 shadow-lg hover:shadow-xl"
            >
              {isEditMode ? "Update Client" : "Add Client"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl max-w-md">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50"></div>
          
          <DialogHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 shadow-lg">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-red-600">
                Confirm Delete
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <div className="relative py-6">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-[#1E293B] font-medium">
                Are you sure you want to delete{" "}
                <strong className="text-red-600">{clientToDelete?.name}</strong>?
              </p>
              <p className="text-sm text-[#1E293B]/70 mt-1">
                This action cannot be undone and will permanently remove all client data.
              </p>
            </div>
          </div>
          
          <DialogFooter className="relative gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-white border-2 border-[#1E293B]/20 text-[#1E293B] hover:bg-[#1E293B]/5"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteClient}
              className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-lg hover:shadow-xl"
            >
              Delete Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}