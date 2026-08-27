"use client";

import {
    FocusEventHandler,
  useState,
  type ChangeEvent,
} from "react";

import { motion, AnimatePresence } from "motion/react";

import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  UserRound,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { IRegisterPayload, registerZodSchema } from "@/app/zod/auth.validation";
import { registerAction } from "@/app/(common)/(authServices)/register/_action";

interface RegisterFormProps {
  redirectPath?: string;
}

export default function RegisterForm({
  redirectPath,
}: RegisterFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const [selectedImage, setSelectedImage] =
    useState<File | undefined>();

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  // ==========================================
  // TanStack Query Mutation
  // ==========================================

  const {
    mutateAsync,
    isPending,
  } = useMutation({
    mutationFn: async ({
      payload,
      image,
    }: {
      payload: IRegisterPayload;
      image?: File;
    }) => {
      return registerAction(
        payload,
        image,
        redirectPath
      );
    },
  });

  // ==========================================
  // TanStack Form
  // ==========================================

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "CANDIDATE" as
        | "CANDIDATE"
        | "RECRUITER",
      agreeToTerms: false,
    },

    onSubmit: async ({ value }: { value: IRegisterPayload }) => {
      setServerError(null);

      try {
        const result = await mutateAsync({
          payload: value,
          image: selectedImage,
        });

        if (
          result &&
          "success" in result &&
          result.success === false
        ) {
          setServerError(
            result.message ||
              "Registration failed"
          );
        } else if (result?.success) {
          toast.success("Account created", {
            description: "Check your inbox for the 6-digit verification code.",
          });

          const params = new URLSearchParams({
            email: result.email ?? "",
          });

          if (redirectPath) {
            params.set("redirect", redirectPath);
          }

          router.push(`/verify-email?${params.toString()}`);
        }
      } catch (error: unknown) {
        console.error(
          "Registration failed:",
          error
        );

        setServerError(
          error instanceof Error
            ? error.message
            : "Registration failed"
        );
      }
    },
  });

  // ==========================================
  // Image handler
  // ==========================================

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Basic frontend validation
    if (!file.type.startsWith("image/")) {
      setServerError(
        "Please select a valid image"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setServerError(
        "Image must be smaller than 5MB"
      );
      return;
    }

    setServerError(null);

    setSelectedImage(file);

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
  };

  return (
    <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/30 sm:rounded-3xl"
        >
          <div className="grid min-w-0 lg:min-h-180 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            {/* ==================================
                LEFT SIDE
            ================================== */}

            <div className="relative hidden overflow-hidden lg:block">
              {/* Background */}
              <motion.div
                initial={{
                  scale: 1.1,
                }}
                animate={{
                  scale: 1,
                }}
                transition={{
                  duration: 1.2,
                }}
                className="absolute inset-0"
              >
                <Image
                  src="https://i.ibb.co/dJxBbFks/brandasset.png"
                  alt="AI Recruitment Platform"
                  fill
                  sizes="(min-width: 1024px) 52vw, 0px"
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-950/90 via-blue-900/60 to-slate-950/90" />

              {/* Back */}
              <motion.button
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => router.push("/")}
                className="absolute left-6 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
                <div />

                <div>
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -30,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                  >
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                      AI-Powered Recruitment
                    </div>

                    <h2 className="max-w-lg text-4xl font-bold leading-tight xl:text-5xl">
                      Build your future with
                      intelligent hiring.
                    </h2>

                    <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">
                      Connect talented candidates
                      with companies using AI-powered
                      recruitment, intelligent matching
                      and smarter hiring workflows.
                    </p>
                  </motion.div>

                  <div className="mt-8 space-y-3">
                    {[
                      "AI-powered candidate matching",
                      "Smart resume analysis",
                      "Intelligent recruitment workflow",
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{
                          opacity: 0,
                          x: -20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            0.5 + index * 0.1,
                        }}
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                          <Check className="h-4 w-4" />
                        </span>

                        <span className="text-sm text-blue-100">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-blue-200">
                  Intelligent hiring. Better careers.
                </p>
              </div>
            </div>

            {/* ==================================
                RIGHT SIDE
            ================================== */}

            <div className="min-w-0 p-5 sm:p-8 lg:flex lg:flex-col lg:justify-center lg:p-12">
              <div className="mx-auto w-full max-w-lg">
                {/* Mobile Back */}
                <div className="mb-7 flex items-center justify-between lg:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      router.push("/")
                    }
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <span className="text-sm font-bold tracking-wide text-slate-400">
                    HIRE<span className="text-blue-600">AI</span>
                  </span>
                </div>

                {/* Header */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.15,
                  }}
                  className="mb-7"
                >
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    Create an account
                  </h1>

                  <p className="mt-2 text-sm text-slate-500">
                    Join our AI-powered recruitment
                    platform.
                  </p>

                  <p className="mt-3 text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </motion.div>

                {/* ==================================
                    FORM
                ================================== */}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    form.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  {/* IMAGE */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                    className="flex justify-center"
                  >
                    <label
                      htmlFor="profile-image"
                      className="group relative cursor-pointer"
                    >
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 transition group-hover:border-blue-500 group-hover:bg-blue-50">
                        <AnimatePresence mode="wait">
                          {previewUrl ? (
                            <motion.img
                              key="image"
                              initial={{
                                opacity: 0,
                                scale: 0.8,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              src={previewUrl}
                              alt="Profile preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <motion.div
                              key="placeholder"
                              initial={{
                                opacity: 0,
                              }}
                              animate={{
                                opacity: 1,
                              }}
                              className="flex flex-col items-center gap-1 text-slate-400"
                            >
                              <ImagePlus className="h-6 w-6" />
                              <span className="text-[10px]">
                                Photo
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </motion.div>

                  {/* NAME */}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <form.Field
                      name="firstName"
                      validators={{
                        onChange:
                          registerZodSchema.shape
                            .firstName,
                      }}
                    >
                      {(field: { name: string | undefined; state: { value: string | number | readonly string[] | undefined; meta: { errors: string | unknown[]; }; }; handleBlur: FocusEventHandler<HTMLInputElement> | undefined; handleChange: (arg0: string) => void; }) => (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            First Name
                          </label>

                          <input
                            name={field.name}
                            value={field.state.value}
                            onBlur={
                              field.handleBlur
                            }
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value
                              )
                            }
                            placeholder="John"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />

                          {field.state.meta
                            .errors.length >
                            0 && (
                            <p className="mt-1 text-xs text-red-500">
                              {
                                String(
                                  field.state.meta
                                    .errors[0]
                                )
                              }
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field
                      name="lastName"
                      validators={{
                        onChange:
                          registerZodSchema.shape
                            .lastName,
                      }}
                    >
                      {(field: { name: string | undefined; state: { value: string | number | readonly string[] | undefined; meta: { errors: string | unknown[]; }; }; handleBlur: FocusEventHandler<HTMLInputElement> | undefined; handleChange: (arg0: string) => void; }) => (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Last Name
                          </label>

                          <input
                            name={field.name}
                            value={field.state.value}
                            onBlur={
                              field.handleBlur
                            }
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value
                              )
                            }
                            placeholder="Doe"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />

                          {field.state.meta
                            .errors.length >
                            0 && (
                            <p className="mt-1 text-xs text-red-500">
                              {String(
                                field.state.meta.errors[0]
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  {/* EMAIL */}

                  <form.Field
                    name="email"
                    validators={{
                      onChange:
                        registerZodSchema.shape
                          .email,
                    }}
                  >
                    {(field: { state: { value: string | number | readonly string[] | undefined; meta: { errors: string | unknown[]; }; }; handleBlur: FocusEventHandler<HTMLInputElement> | undefined; handleChange: (arg0: string) => void; }) => (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Email Address
                        </label>

                        <input
                          type="email"
                          value={field.state.value}
                          onBlur={
                            field.handleBlur
                          }
                          onChange={(e) =>
                            field.handleChange(
                              e.target.value
                            )
                          }
                          placeholder="john@example.com"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />

                        {field.state.meta
                          .errors.length >
                          0 && (
                          <p className="mt-1 text-xs text-red-500">
                            {String(
                              field.state.meta.errors[0]
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  {/* PASSWORD */}

                  <form.Field
                    name="password"
                    validators={{
                      onChange:
                        registerZodSchema.shape
                          .password,
                    }}
                  >
                    {(field: { state: { value: string | number | readonly string[] | undefined; meta: { errors: string | unknown[]; }; }; handleBlur: FocusEventHandler<HTMLInputElement> | undefined; handleChange: (arg0: string) => void; }) => (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Password
                        </label>

                        <div className="relative">
                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={
                              field.state.value
                            }
                            onBlur={
                              field.handleBlur
                            }
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value
                              )
                            }
                            placeholder="Create a strong password"
                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                (value) =>
                                  !value
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        {field.state.meta
                          .errors.length >
                          0 && (
                          <p className="mt-1 text-xs text-red-500">
                            {
                              String(
                                field.state.meta.errors[0]
                              )
                            }
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  {/* ROLE */}

                  <form.Field name="role">
                    {(field) => (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          I am joining as
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          {[
                            {
                              value:
                                "CANDIDATE" as const,
                              title:
                                "Candidate",
                              description:
                                "Find your next opportunity",
                            },
                            {
                              value:
                                "RECRUITER" as const,
                              title:
                                "Recruiter",
                              description:
                                "Find great candidates",
                            },
                          ].map((role) => {
                            const active =
                              field.state
                                .value ===
                              role.value;

                            return (
                              <motion.button
                                key={
                                  role.value
                                }
                                type="button"
                                whileHover={{
                                  y: -2,
                                }}
                                whileTap={{
                                  scale: 0.98,
                                }}
                                onClick={() =>
                                  field.handleChange(
                                    role.value
                                  )
                                }
                                className={`rounded-xl border p-3 text-left transition sm:p-4 ${
                                  active
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <UserRound
                                    className={`h-5 w-5 ${
                                      active
                                        ? "text-blue-600"
                                        : "text-slate-400"
                                    }`}
                                  />

                                  {active && (
                                    <Check className="h-4 w-4 text-blue-600" />
                                  )}
                                </div>

                                <p className="mt-3 text-sm font-semibold text-slate-900">
                                  {role.title}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    role.description
                                  }
                                </p>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </form.Field>

                  {/* TERMS */}

                  <form.Field
                    name="agreeToTerms"
                    validators={{
                      onChange:
                        registerZodSchema.shape
                          .agreeToTerms,
                    }}
                  >
                    {(field: { state: { value: boolean | undefined; meta: { errors: string | unknown[]; }; }; handleChange: (arg0: boolean) => void; }) => (
                      <div>
                        <label className="flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            checked={
                              field.state.value
                            }
                            onChange={(e) =>
                              field.handleChange(
                                e.target.checked
                              )
                            }
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />

                          <span className="text-sm leading-6 text-slate-600">
                            I agree to the{" "}
                            <button
                              type="button"
                              className="font-medium text-slate-900 hover:underline"
                            >
                              Terms &
                              Conditions
                            </button>
                          </span>
                        </label>

                        {field.state.meta
                          .errors.length >
                          0 && (
                          <p className="mt-1 text-xs text-red-500">
                            {String(
                              field.state.meta.errors[0]
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  {/* SERVER ERROR */}

                  <AnimatePresence>
                    {serverError && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -8,
                        }}
                      >
                        <div
                          role="alert"
                          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                        >
                          {serverError}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* SUBMIT */}

                  <form.Subscribe
                    selector={(state) => [
                      Boolean(state.canSubmit),
                      Boolean(state.isSubmitting),
                    ] as const}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <motion.div
                        whileHover={
                          canSubmit && !isPending
                            ? {
                                scale: 1.01,
                              }
                            : {}
                        }
                        whileTap={
                          canSubmit && !isPending
                            ? {
                                scale: 0.99,
                              }
                            : {}
                        }
                      >
                        <Button
                          type="submit"
                          disabled={
                            !canSubmit ||
                            isPending ||
                            isSubmitting
                          }
                          className="h-12 w-full rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
                        >
                          {isPending ||
                          isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating your
                              account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </form.Subscribe>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
  );
}