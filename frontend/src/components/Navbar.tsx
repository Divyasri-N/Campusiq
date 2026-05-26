import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div
      style={{
        width: "100%", // same feel as hero container width
        margin: "12px auto 3px auto", // 👈 3px gap below navbar
        background: "linear-gradient(135deg, #1e40af 0%, #1e3a5f 100%)",
        padding: "10px 26px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "15px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 10,
        zIndex: 1000,
        boxSizing: "border-box",
      }}
    >
      {/* BRAND */}
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "white",
          fontSize: 20,
          fontWeight: 800,
        }}
      >
        🎓 CampusIQ
      </Link>

      {/* LINKS */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {["Home", "Compare", "Predictor"].map((item, index) => {
          const path =
            item === "Home"
              ? "/"
              : item === "Compare"
              ? "/compare"
              : "/predictor";

          return (
            <Link
              key={index}
              to={path}
              style={{
                color: "#e2e8f0",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                padding: "6px 10px",
                borderRadius: 8,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(0px)";
              }}
            >
              {item}
            </Link>
          );
        })}

        {/* BUTTON */}
        <Link to="/">
          <button
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
              marginLeft: 6,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1.05)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "#2563eb";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "#3b82f6";
            }}
          >
            Explore Courses
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;