import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { api_endpoint } from "../../contents/index"

const CheckEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    console.log("Check Email form submitted")
    const response = await fetch(api_endpoint + "/auth/checkEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ verificationCode: data.verificationCode })
    })
    if (response.ok) {
      console.log("Check Email successful")
      navigate("/signin")
    } else {
      console.error("Check Email failed")
      alert("認証コードが違います")
    }
  }

  const handleResendEmail = () => {
    fetch(api_endpoint + "/auth/resendEmail", {
      method: "POST"
    }).then((response) => {
      if (response.ok) {
        console.log("Resend Email successful")
        alert("Resend Email successful")
      } else {
        console.error("Resend Email failed")
        alert("Resend Email failed")
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-1.5 w-60 items-center mb-2 mt-2">
      <input
        type="text"
        placeholder="VerificationCode"
        {...register("verificationCode", {
          required: "コードを入力してください",
          minLength: { value: 6, message: "正しいコードを入力してください" },
          maxLength: { value: 6, message: "正しいコードを入力してください" }
        })}
        className="border border-gray-300 rounded-md px-4 py-1 w-5/6"
      />
      {errors.verificationCode &&
        typeof errors.verificationCode.message === "string" && (
          <span className="text-red-500 text-sm">
            {errors.verificationCode.message}
          </span>
        )}
      <div className="flex justify-center space-x-3">
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-3 py-2 hover:bg-blue-700">
          Check
        </button>
        <button
          onClick={handleResendEmail}
          type="button"
          className="bg-green-500 text-white rounded-md px-3 py-2 hover:bg-green-700">
          Resend
        </button>
        <button
          onClick={() => navigate("/signup")}
          type="button"
          className="bg-gray-500 text-white rounded-md px-3 py-2 hover:bg-gray-700">
          Back
        </button>
      </div>
    </form>
  )
}

export default CheckEmail
