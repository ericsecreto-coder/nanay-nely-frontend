"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createProductAction,
  deleteProductAction,
  toggleProductActiveAction,
  updateProductAction
} from "@/app/actions/products";
import { useToast } from "@/components/ui/toast-provider";
import { formatPrice } from "@/lib/utils/format";
import type { Product } from "@/lib/types/database";

type Props = {
  products: Product[];
};

const emptyForm = {
  name: "",
  origin: "Infanta, Quezon",
  description: "",
  price: "",
  image_url: "",
  is_active: true,
  stock: ""
};

export function ProductManager({ products }: Props) {
  const { showToast } = useToast();
  const [items, setItems] = useState(products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const editingProduct = useMemo(
    () => items.find((product) => product.id === editingId) ?? null,
    [editingId, items]
  );

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      origin: product.origin,
      description: product.description,
      price: String(product.price),
      image_url: product.image_url,
      is_active: product.is_active,
      stock: String(product.stock)
    });
    setMessage(null);
    setError(null);
  }

  function buildFormData() {
    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("origin", form.origin);
    formData.set("description", form.description);
    formData.set("price", form.price);
    formData.set("image_url", form.image_url);
    formData.set("stock", form.stock || "0");
    if (form.is_active) {
      formData.set("is_active", "on");
    }
    return formData;
  }

  function handleSubmit() {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const formData = buildFormData();
      const result = editingId
        ? await updateProductAction(editingId, formData)
        : await createProductAction(formData);

      if (result.error) {
        setError(result.error);
        showToast(result.error, "error");
        return;
      }

      const msg = editingId ? "Product updated." : "Product created.";
      setMessage(msg);
      showToast(msg, "success");
      resetForm();
      window.location.reload();
    });
  }

  function handleDelete(productId: string) {
    if (!window.confirm("Delete this product permanently?")) {
      return;
    }

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (result.error) {
        setError(result.error);
        showToast(result.error, "error");
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== productId));
      setMessage("Product deleted.");
      showToast("Product deleted.", "success");
    });
  }

  function handleToggle(productId: string, isActive: boolean) {
    startTransition(async () => {
      const result = await toggleProductActiveAction(productId, isActive);
      if (result.error) {
        setError(result.error);
        showToast(result.error, "error");
        return;
      }
      showToast(isActive ? "Product is now visible." : "Product hidden.", "success");
      setItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, is_active: isActive } : item))
      );
    });
  }

  return (
    <div className="admin-products-layout">
      <section className="dc">
        <h2 className="dc-title">{editingProduct ? "Edit Product" : "Add Product"}</h2>
        <div className="admin-form-grid">
          <div className="fg">
            <label className="fl">Name</label>
            <input className="fi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Origin</label>
            <input className="fi" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
          </div>
          <div className="fg">
            <label className="fl">Price (PHP)</label>
            <input
              className="fi"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="fg">
            <label className="fl">Image URL</label>
            <input
              className="fi"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            />
          </div>
          <div className="fg">
            <label className="fl">Stock Quantity</label>
            <input
              className="fi"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>
          <div className="fg admin-form-full">
            <label className="fl">Description</label>
            <textarea
              className="fi"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active on storefront
          </label>
        </div>

        {error && <p className="auth-alert auth-alert-error">{error}</p>}
        {message && <p className="auth-alert auth-alert-success">{message}</p>}

        <div className="admin-form-actions">
          <button type="button" className="btn btn-amber" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
          </button>
          {editingProduct && (
            <button type="button" className="btn btn-ghost" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </section>

      <section className="dc">
        <h2 className="dc-title">All Products ({items.length})</h2>
        <table className="ot">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1.25rem" }}>
                No products yet. Add your first product above.
              </td>
            </tr>
          ) : (
            items.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--w55)" }}>{product.origin}</div>
                </td>
                <td>{formatPrice(Number(product.price))}</td>
                <td>
                  <span className={`sbadge ${product.stock > 0 ? "s-del" : "s-pend"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </td>
                <td>
                  <span className={`sbadge ${product.is_active ? "s-del" : "s-pend"}`}>
                    {product.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => startEdit(product)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleToggle(product.id, !product.is_active)}
                        disabled={isPending}
                      >
                        {product.is_active ? "Hide" : "Show"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleDelete(product.id)}
                        disabled={isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
