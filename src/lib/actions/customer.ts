
"use server";

import { medusaSdk } from "@/lib/mdedusa-sdk";
import { revalidatePath } from "next/cache";
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
    email: z.string().email(),
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


// Helper to handle Medusa errors
const handleError = (error: unknown): { success: false; error: string } => {
  let errorMessage = "An unexpected error occurred.";
  if (error instanceof Error) {
    // This is a generic error
    errorMessage = error.message;
  }
  // Medusa SDK throws an object with a message property on API errors
  else if (typeof error === 'object' && error !== null && 'message' in error) {
     const medusaError = error as { message: string | { [key: string]: any } };
     if (typeof medusaError.message === 'string') {
        errorMessage = medusaError.message;
     } else {
        errorMessage = "An unknown API error occurred."
     }
  }
  console.error(errorMessage);
  return { success: false, error: errorMessage };
};

// Actions
export async function loginAction(data: unknown) {
  const validation = LoginSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid input." };
  }
  try {
    const { response } = await medusaSdk.store.customer.login(validation.data);
    if(response.status !== 200) {
        throw new Error("Login failed. Please check your credentials.");
    }
    revalidatePath('/account');
    return { success: true, data: response.data.customer };
  } catch (error) {
    return handleError(error);
  }
}

export async function registerAction(data: unknown) {
  const validation = RegisterSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: "Invalid input." };
  }
  const { firstName, lastName, ...rest } = validation.data;
  try {
    const { response } = await medusaSdk.store.customer.create({ first_name: firstName, last_name: lastName, ...rest });
    return { success: true, data: response.data.customer };
  } catch (error) {
    return handleError(error);
  }
}

export async function logoutAction() {
    try {
        await medusaSdk.store.customer.logout();
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return handleError(error);
    }
}

export async function getSessionAction() {
    try {
        const { response } = await medusaSdk.store.customer.retrieve();
        if (response.status !== 200) return { success: false, error: 'Not authenticated' };
        return { success: true, data: response.data.customer };
    } catch (error) {
        return { success: false, error: 'Not authenticated' };
    }
}

export async function getAddressesAction() {
    try {
        const { response } = await medusaSdk.store.customer.addresses.list();
        return { success: true, data: response.data.addresses };
    } catch (error) {
        return handleError(error);
    }
}

export async function getOrdersAction() {
    try {
        const { response } = await medusaSdk.store.customer.orders.list();
        return { success: true, data: response.data.orders };
    } catch (error) {
        return handleError(error);
    }
}

export async function updateProfileAction(data: unknown) {
    const validation = ProfileSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input." };
    }
     const { firstName, lastName, ...rest } = validation.data;
    try {
        const { response } = await medusaSdk.store.customer.update({ first_name: firstName, last_name: lastName, ...rest });
        revalidatePath('/account');
        return { success: true, data: response.data.customer };
    } catch (error) {
        return handleError(error);
    }
}

export async function addAddressAction(data: unknown) {
    const validation = AddressSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input." };
    }
    try {
        const { response } = await medusaSdk.store.customer.addresses.add({ address: validation.data });
        revalidatePath('/account');
        return { success: true, data: response.data.customer };
    } catch (error) {
        return handleError(error);
    }
}

export async function updateAddressAction(addressId: string, data: unknown) {
    const validation = AddressSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: "Invalid input." };
    }
    try {
        const { response } = await medusaSdk.store.customer.addresses.update({ addressId, address: validation.data });
        revalidatePath('/account');
        return { success: true, data: response.data.customer };
    } catch (error) {
        return handleError(error);
    }
}

export async function deleteAddressAction(addressId: string) {
    try {
        const { response } = await medusaSdk.store.customer.addresses.delete({ addressId });
        revalidatePath('/account');
        return { success: true, data: response.data };
    } catch (error) {
        return handleError(error);
    }
}
