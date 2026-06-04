export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#000000', 
      color: '#fff', 
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem', 
        border: '2px solid #333', 
        borderRadius: '12px', 
        backgroundColor: '#222' 
      }}>
        <h1> Testeeeeeee </h1>
        <p style={{ fontSize: '24px', color: '#4ade80', fontWeight: 'bold', margin: '20px 0' }}>
          O container do seu frontend está online e rodando! 🚀
        </p>
      </div>
    </div>
  );
}