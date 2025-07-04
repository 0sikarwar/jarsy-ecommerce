"use client";

import { medusaSdk } from "@/lib/mdedusa-sdk";
import { z } from "zod";

// Schemas
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const RegisterSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

const ProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
});

const AddressSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  address_1: z.string(),
  address_2: z.string().optional(),
  city: z.string(),
  province: z.string().optional(),
  postal_code: z.string(),
  country_code: z.string(),
  phone: z.string().optional(),
});

const handleError = (msg: string, error?: unknown): { success: false; error: string } => {
  let errorMessage = msg || "An unexpected error occurred.";
  console.error(error);
  return { success: false, error: errorMessage };
};

export async function loginAction(data: unknown) {
  const validation = LoginSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid input." };
  }
  const { email, password } = validation.data;
  try {
    const result = await medusaSdk.auth.login("customer", "emailpass", {
      email,
      password,
    });

    if (typeof result !== "string") {
      alert("Authentication requires additional steps");
      window.location.href = result.location;
      return;
    }
    medusaSdk.client.setToken(result);
    const { customer } = await medusaSdk.store.customer.retrieve();
    return { success: true, data: customer, error: null };
  } catch (error) {
    return handleError("Login failed. Please check your credentials.", error);
  }
}

export async function registerAction(data: unknown) {
  const validation = RegisterSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid input." };
  }
  try {
    const { firstName, lastName, email, password, phone, ...metadata } = validation.data;

    const token = await medusaSdk.auth.register("customer", "emailpass", { email, password });

    const { customer } = await medusaSdk.store.customer.create(
      {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        metadata,
      },
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return { success: true, data: customer, error: null };
  } catch (error) {
    return handleError("Registration failed. Please try again.", error);
  }
}

export async function logoutAction() {
  try {
    await medusaSdk.auth.logout();
    return { success: true, error: null };
  } catch (error) {
    return handleError("Logout failed. Please try again.", error);
  }
}

export async function getSessionAction() {
  try {
    const { customer } = await medusaSdk.store.customer.retrieve();
    return { success: true, data: customer, error: null };
  } catch (error) {
    return { success: false, error: "Not authenticated" };
  }
}

export async function getAddressesAction() {
  try {
    const { addresses } = await medusaSdk.store.customer.listAddress();
    return { success: true, data: addresses, error: null };
  } catch (error) {
    return handleError("", error);
  }
}

export async function getOrdersAction() {
  try {
    const { orders } = await medusaSdk.store.order.list();
    return { success: true, data: orders, error: null };
  } catch (error) {
    return handleError("", error);
  }
}

export async function updateProfileAction(data: unknown) {
  const validation = ProfileSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid input." };
  }
  const { firstName, lastName, ...metadata } = validation.data;
  try {
    const { customer } = await medusaSdk.store.customer.update({
      first_name: firstName,
      last_name: lastName,
      metadata,
    });
    return { success: true, data: customer, error: null };
  } catch (error) {
    return handleError("", error);
  }
}

export async function addAddressAction(data: unknown) {
  const validation = AddressSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid input." };
  }
  try {
    const { customer } = await medusaSdk.store.customer.createAddress(validation.data);
    return { success: true, data: customer, error: null };
  } catch (error) {
    return handleError("", error);
  }
}

export async function updateAddressAction(addressId: string, data: unknown) {
  const validation = AddressSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid input." };
  }
  try {
    const { customer } = await medusaSdk.store.customer.updateAddress(addressId, validation.data);
    return { success: true, data: customer, error: null };
  } catch (error) {
    return handleError("", error);
  }
}

export async function deleteAddressAction(addressId: string) {
  try {
    const { parent: customer } = await medusaSdk.store.customer.deleteAddress(addressId);
    return { success: true, data: customer, error: null };
  } catch (error) {
    return handleError("", error);
  }
}
