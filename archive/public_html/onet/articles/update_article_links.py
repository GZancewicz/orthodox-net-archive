from bs4 import BeautifulSoup


def update_article_links(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")

    # Find the div with id "page-content"
    page_content = soup.find("div", id="page-content")

    # Find all <a> tags within this div
    links = page_content.find_all("a", href=True)

    for link in links:
        href = link["href"]
        # Update href if it's not an anchor link
        if not href.startswith("#"):
            # Remove .html extension if present
            if href.endswith(".html"):
                href = href[:-5]
            link["href"] = f"article.html?{href}"

    # Write the modified HTML to the output file
    with open(output_file, "w", encoding="utf-8") as file:
        file.write(str(soup))


# Usage
update_article_links("_index.html", "index.html")
