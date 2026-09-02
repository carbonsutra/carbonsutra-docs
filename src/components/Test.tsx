export const MyCustomForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log("Submitted data:", Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        className="border p-2"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
};
