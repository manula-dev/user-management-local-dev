import { authService } from "../services/auth.service.js";
import { signupSchema, loginSchema } from "../schemas/auth.schemas.js";
import { catchAsync } from "../utils/catchAsync.js"; // 👈 catchAsync එක Import කරගන්න

function getValidationMessage(error) {
  return error?.issues?.[0]?.message || "Invalid request body";
}

// 1. Handle Login
export const handleLogin = catchAsync(async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: getValidationMessage(result.error),
    });
  }

  // සර්විස් එක ඇතුලේ "Invalid credentials" වැරැද්ද ආවොත්, 
  // ඒක Global Error Handler එකට යවන්න කලින් මෙතනදීම අල්ලනවා.
  try {
    const loginResult = await authService.login(
      result.data.email,
      result.data.password
    );
    return res.status(200).json(loginResult);
  } catch (error) {
    if (error?.message === "Invalid credentials") {
      return res.status(401).json({ error: error.message });
    }
    throw error; // වෙනත් සර්වර් වැරැද්දක් නම් catchAsync එකට විසි කරනවා
  }
});

// 2. Handle Signup
export const handleSignup = catchAsync(async (req, res, next) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: getValidationMessage(result.error),
    });
  }

  // Prisma එකෙන් දැනටමත් ඊමේල් එක තියෙනවා කියලා එන වැරැද්ද (P2002) මෙතනදී අල්ලනවා.
  try {
    const user = await authService.signup(result.data);
    return res.status(201).json(user);
  } catch (error) {
    if (error?.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }
    throw error; // වෙනත් සර්වර් වැරැද්දක් නම් catchAsync එකට විසි කරනවා
  }
});
