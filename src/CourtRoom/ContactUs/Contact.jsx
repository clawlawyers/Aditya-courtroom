import React, { useState } from "react";
import courtroomContact from "../../assets/images/courtroomContact.gif";
import { motion } from "framer-motion";
import toast, { LoaderIcon } from "react-hot-toast";
import { NODE_API_ENDPOINT } from "../../utils/utils";
import successIcon from "../../assets/images/Successfully Done.gif";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [query, setQuery] = useState("");
  const [contactMode, setContactMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Prepare the data to send
    const data = {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      preferredContactMode: contactMode,
      businessName: business,
      query,
    };

    try {
      // Make the API request
      const response = await fetch(
        `${NODE_API_ENDPOINT}/courtroom/add/ContactUsQuery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        // Handle successful response
        const result = await response.json();
        toast.success("Your message has been sent successfully!");
        setSuccess(true);
        // Reset the form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setBusiness("");
        setQuery("");
        setContactMode("");
        setLoading(false);
      } else {
        // Handle server errors
        const result = await response.json();
        toast.error(result.message || "Failed to send the message.");
        setLoading(false);
      }
    } catch (error) {
      // Handle network or other errors
      toast.error("An error occurred while sending your message.");
      setLoading(false);
    }
  };

  return (
    <div
      className="pt-14"
      style={{
        background: `radial-gradient(circle at 50% 0%, #018585, transparent 50%),
    radial-gradient(circle at 100% 60%, #351f58d0, transparent 40%),
    radial-gradient(circle at 0% 100%, #018585, transparent 50%)`,
      }}
    >
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-white text-6xl font-bold">Get In Touch</h1>
        <p className="m-0  mt-5 text-white text-lg font-bold">
          Want to get along with the 1st Generative AI in Indian Legal Niche?
        </p>
        <p className="text-white text-lg">We are waiting to hear from you</p>
      </div>
      <div className="md:grid md:grid-cols-[40%_60%] items-center text-black">
        <div className="">
          <img
            style={{ width: "100%", height: "100%" }}
            src={courtroomContact}
            alt="contact"
          />
        </div>
        <div>
          <form onSubmit={handleSave}>
            <div style={{ position: "relative" }} className="mx-5">
              {!success ? (
                <div
                  className="p-3"
                  style={{
                    background: "linear-gradient(135deg,#0e5156,#018585 90%)",
                    border: "2px solid white",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    className="grid grid-cols-2 gap-3"
                    style={{ margin: "20px 10px" }}
                  >
                    <input
                      className="p-2 border border-black rounded-md"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      className="p-2 border border-black rounded-md"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                      className="p-2 border border-black rounded-md"
                      placeholder="E-Mail ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="p-2 border border-black rounded-md"
                      placeholder="Mobile No."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                      className="col-span-2 p-2 border border-black rounded-md"
                      placeholder="Business Name"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                    />
                    <textarea
                      className="col-span-2 p-2 border border-black rounded-md text-black"
                      placeholder="Enter your Query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <div
                    className="flex justify-center items-center mb-3 gap-3"
                    style={{ wordSpacing: "2px" }}
                  >
                    <h2 className="text-lg m-0 text-white leading-none">
                      Preferred Contact Mode :{" "}
                    </h2>
                    <div className="flex gap-3">
                      <div className="flex gap-1">
                        <input
                          type="radio"
                          value="email"
                          checked={contactMode === "email"}
                          onChange={(e) => setContactMode(e.target.value)}
                          className=""
                        />
                        <h1 className="m-0 text-lg text-white">via E-Mail</h1>
                      </div>
                      <div className="flex gap-1">
                        <input
                          type="radio"
                          value="call"
                          checked={contactMode === "call"}
                          onChange={(e) => setContactMode(e.target.value)}
                          className=""
                        />
                        <h1 className="m-0 text-lg text-white">via Call</h1>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <motion.button
                      whileTap={{ scale: "0.95" }}
                      type="submit"
                      style={{ border: "2px solid white" }}
                      className="w-full px-24 py-2 rounded-md bg-transparent text-white text-xl font-bold flex justify-center"
                    >
                      {loading ? <LoaderIcon /> : "Send"}
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div
                  className="m-10 w-full h-full flex items-center justify-center p-3"
                  style={{
                    background: "linear-gradient(135deg,#0e5156,#018585 90%)",
                    border: "2px solid white",
                    borderRadius: "10px",
                  }}
                >
                  <div className="flex flex-col items-center justify-center">
                    <img
                      alt="success"
                      src={successIcon}
                      className="h-28 w-28"
                    />
                    <p className="m-0  mt-1 text-white text-lg font-bold">
                      Thank You For Contacting Us
                    </p>
                    <p className="text-white text-sm">
                      Our Team Will Reach You Shortly
                    </p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
