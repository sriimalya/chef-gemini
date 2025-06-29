import ReactMarkdown from 'react-markdown'


export default function Recipe({recipe, loading}) {
    if (loading) {
    return (
      <div className="recipe-box loading">
        <h2>Generating your recipe...</h2>
        <div className="dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    );
  }
    return (
        <div className="recipe-box">
            <h2>Generated Recipe:</h2>
            <ReactMarkdown>
            {recipe}
            </ReactMarkdown>
        </div>
    );
}