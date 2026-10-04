function NotesInput({
    notes,
    setNotes,
    onPDFUpload,
    pdfLoading
}) {
    return (
        <section className="notes-section">

            <h3>Your Notes</h3>

            <div className="pdf-upload">

                <label htmlFor="pdf-file">
                    {pdfLoading
                        ? "Processing PDF..."
                        : "Upload PDF"}
                </label>

                <input
                    id="pdf-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) =>
                        onPDFUpload(e.target.files[0])
                    }
                    disabled={pdfLoading}
                />

                <span>
                    Upload your study notes as a PDF
                </span>

            </div>

            <div className="upload-divider">
                <span>OR</span>
            </div>

            <textarea
                value={notes}
                onChange={(e) =>
                    setNotes(e.target.value)
                }
                placeholder="Paste your study notes here..."
            />

        </section>
    );
}

export default NotesInput;