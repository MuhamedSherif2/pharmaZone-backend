import z from "zod";
import { sanitizeField } from "../sanitizeField.js";

export const createAccountSchema = z
  .object({
    name: z.string().min(2, "الاسم قصير جدًا"),
    email: z.string().email("البريد الإلكتروني غير صحيح"),
    password: z
      .string()
      .min(8, "كلمة المرور 8 أحرف على الأقل")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "يجب أن تحتوي على حرف صغير وكبير ورقم"
      ),
    phone: z
      .string({ error: "رقم التليفون مطلوب" })
      .regex(/^01[0125][0-9]{8}$/, "رقم الموبايل غير صحيح"),
    role: z.enum(["user", "pharmacy"]),
  })
  .strict();

export const createPharmacySchema = z
  .object({
    isOpen24h: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z
      .object({
        lat: z
          .number({ message: "خط العرض مطلوب" })
          .min(-90, "خط العرض غير صحيح")
          .max(90, "خط العرض غير صحيح")
          .nullable(),
        lng: z
          .number({ message: "خط الطول مطلوب" })
          .min(-180, "خط الطول غير صحيح")
          .max(180, "خط الطول غير صحيح")
          .nullable(),
        address: z.string().optional(),
      })
      .strict(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const { lng, lat } = data.location;

    if ((lng !== null && lat === null) || (lng === null && lat !== null)) {
      ctx.addIssue({
        path: ["location"],
        message: "يجب إدخال خط العرض وخط الطول معًا",
        code: z.ZodIssueCode.custom,
      });
    }

    if (!data.isOpen24h) {
      if (!data.startTime || !data.endTime) {
        ctx.addIssue({
          path: ["startTime"],
          message: "مواعيد العمل مطلوبة إذا لم تكن الصيدلية تعمل 24 ساعة",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export const loginSchema = z
  .object({
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صحيح")
      .trim(),
    password: z
      .string()
      .min(1, "كلمة المرور مطلوبة")
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .trim(),
  })
  .strict();

export const verifySchema = z
  .object({
    otp: z
      .string()
      .min(6, "الكود يجب أن يكون 6 أرقام")
      .max(6, "الكود يجب أن يكون 6 أرقام")
      .regex(/^\d+$/, "الكود يجب أن يحتوي على أرقام فقط"),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "البريد الإلكتروني مطلوب")
      .email("البريد الإلكتروني غير صحيح"),
  })
  .strict();
export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .min(6, "الكود يجب أن يكون 6 أرقام")
      .max(6, "الكود يجب أن يكون 6 أرقام")
      .regex(/^\d+$/, "الكود يجب أن يحتوي على أرقام فقط"),
    password: z
      .string()
      .min(8, "كلمة المرور 8 أحرف على الأقل")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "يجب أن تحتوي على حرف صغير وكبير ورقم"
      ),
  })
  .strict();
