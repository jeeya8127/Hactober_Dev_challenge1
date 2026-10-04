function Summary({ summary }) {
    if (!summary) {
        return null;
    }

    const cleanLine = (line) => {
        return line
            .replace(/\*\*/g, "")
            .replace(/__/g, "")
            .replace(/^#{1,6}\s*/, "")
            .replace(/^[-*]\s*/, "")
            .replace(/`/g, "")
            .trim();
    };

    const lines = summary
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

    return (
        <section className="result-section">

            <h3>AI Summary</h3>

            <div className="summary-content">

                {lines.map((line, index) => {

                    const isHeading =
                        /^#{1,6}\s/.test(line) ||
                        (
                            line.length < 80 &&
                            !line.endsWith(".") &&
                            !line.startsWith("-") &&
                            !line.startsWith("*")
                        );

                    const cleaned = cleanLine(line);

                    return isHeading ? (
                        <h4 key={index}>
                            {cleaned}
                        </h4>
                    ) : (
                        <p key={index}>
                            {cleaned}
                        </p>
                    );
                })}

            </div>

        </section>
    );
}

export default Summary;