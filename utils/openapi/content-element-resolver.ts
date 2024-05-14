import { hasProperty } from '../object-utis';
import { Article, DocMessage, Paragraph } from './types';

export class ParsedXmlContentResolver {
  static convertSingleParagraph(paragraph: Paragraph): string {
    const tagName = paragraph.tagName;
    const textContent = paragraph['#text'];
    const marginLeft = paragraph.marginLeft || '0';
    return `<${tagName} style="margin-left: ${marginLeft}"> ${textContent}</${tagName}>`;
  }

  static convertParagraphs(paragraphes: Paragraph | Paragraph[]): string {
    let fullParagraph = '';
    if (Array.isArray(paragraphes)) {
      fullParagraph = paragraphes
        .map((paragraph) => {
          return ParsedXmlContentResolver.convertSingleParagraph(paragraph);
        })
        .join(' ');
    } else {
      fullParagraph = ParsedXmlContentResolver.convertSingleParagraph(paragraphes);
    }
    return fullParagraph;
  }

  static resolveParsedXmlContent(parsedXmlJsonData: DocMessage) {
    const articles = parsedXmlJsonData.DOC.SECTION.ARTICLE;
    let articleContent = '';
    let paragraphContent = '';
    if (hasProperty(articles, 'PARAGRAPH')) {
      const articleTitle = (articles as Article).title;
      const paragraphes = (articles as Article).PARAGRAPH;
      paragraphContent = ParsedXmlContentResolver.convertParagraphs(paragraphes!);
      articleContent = `<h3>${articleTitle}</h3>${paragraphContent}`;
    }

    const rootTitle = `<h1>${parsedXmlJsonData.DOC.title}</h1>`;
    if (Array.isArray(articles)) {
      articleContent = articles
        .map((article) => {
          if (hasProperty(article, 'PARAGRAPH')) {
            const articleTitle = article.title;
            const childParagraphContent = ParsedXmlContentResolver.convertParagraphs(
              article.PARAGRAPH!
            );
            return `<h3>${articleTitle}</h3>${childParagraphContent}`;
          } else {
            return `<p>${article.title}</p>`;
          }
        })
        .join(' ');
    } else {
      articleContent = `<p>${articles.title}</p>`;
    }

    const fullHtmlContents = `<div>${rootTitle}${articleContent}${paragraphContent}</div>`;
    return fullHtmlContents;
  }
}
