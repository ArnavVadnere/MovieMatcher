import React from "react";

const PreferencesPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-900 to-indigo-800 text-white">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">MovieMatcher</h1>
      </header>
      <section className="w-full max-w-2xl bg-white bg-opacity-10 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl mb-4 text-center">Edit Preferences</h2>
        <form className="preferences-form">
          <fieldset className="mb-6">
            <legend className="text-xl mb-2">Favorite Genres:</legend>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Action
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Comedy
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Drama
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Horror
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Sci-Fi
            </label>
          </fieldset>
          <fieldset className="mb-6">
            <legend className="text-xl mb-2">Streaming Services:</legend>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Netflix
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Hulu
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Prime Video
            </label>
            <label className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" /> Disney+
            </label>
          </fieldset>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md transition duration-300 text-lg"
          >
            Save
          </button>
        </form>
      </section>
    </div>
  );
};

export default PreferencesPage;
