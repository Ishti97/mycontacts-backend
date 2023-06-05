const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

//@desc User Register
//@route Post /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All field are mandatory");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    throw new Error("User already registered");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`User created ${user}`);

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@desc User Login
//@route Post /api/users/login
//@access public
const loginUser = asyncHandler(
  async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({ email });
    //compare password with hashedpassword
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign({
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      });

      res.status(200).json({ accessToken });
    } else {
      res.status(400);
      throw Error("Email password not valid");
    }
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expireIn: "15m" }
);

//@desc Current User
//@route Get /api/users/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
