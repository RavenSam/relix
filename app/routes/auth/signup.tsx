import { useActionData, json, redirect, MetaFunction } from "remix"
// import { db } from "~/lib/db.server"
// import { createUserSession, register } from "~/lib/session.server"
// import type { ActionFunction } from "remix"
import { signup_inputs } from "../../../config/inputs"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { signupSchema } from "../../../config/yupSchema"

// export const action: ActionFunction = async ({ request }) => {
//    const form = await request.formData()

//    const fields = { username: form.get("username"), email: form.get("email"), password: form.get("password") }

//    // Check if user exists
//    const userExists = await db.user.findFirst({ where: { username: fields.username } })
//    const emailExists = await db.user.findFirst({ where: { email: fields.email } })

//    if (userExists) {
//       return json({ fieldErrors: { username: "username already taken" } })
//    }

//    if (emailExists) {
//       return json({ fieldErrors: { email: "email already registred" } })
//    }

//    // Create user
//    const user = await register(fields)
//    if (!user) {
//       return json({ fieldErrors: { form: "Something went wrong" } })
//    }

//    // Create user session
//    return createUserSession(user.id, "/posts")
// }

export default function Signup(): JSX.Element {
   const actionData = useActionData()
   const { register, formState } = useForm({ mode: "onBlur", resolver: yupResolver(signupSchema) })
   const { errors, isSubmitting } = formState

   return (
      <div className="mt-6">
         {actionData?.fieldErrors?.form && (
            <div className="alert alert-error">
               <div className="flex-1">
                  <label>{actionData.fieldErrors?.form}</label>
               </div>
            </div>
         )}

         <form method="POST" className="accent-primary space-y-4 mt-2">
            {signup_inputs.map((input, i) => (
               <div key={i} className="form-control">
                  <label className="label">
                     <span className="label-text capitalize">{input.label}</span>
                  </label>
                  <input
                     type={input.type}
                     placeholder={input.placeholder}
                     {...register(input.name)}
                     className="input focus:input-accent input-bordered"
                  />
                  {errors[input.name] && (
                     <label className="label">
                        <span className="label-text-alt text-pink-500">{errors[input.name]?.message}</span>
                     </label>
                  )}
               </div>
            ))}

            <div className="form-control">
               <label className="cursor-pointer label !justify-start gap-2">
                  <input type="checkbox" className="checkbox checked:checkbox-accent focus:checkbox-accent " />
                  <span className="label-text">I agree to terms</span>
               </label>
            </div>

            <button type="submit" className="btn btn-accent px-8 rounded-full">
               Sign Up
            </button>
         </form>
      </div>
   )
}

export const meta: MetaFunction = () => {
   const title = "Register - ReBlox"
   const description = "A react blog build with remix and tailwindCSS"
   const keywords = "react, tailwind, javascript, remix"

   return { title, description, keywords }
}
