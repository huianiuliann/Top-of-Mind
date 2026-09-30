# Gates: site trust content (Research Sprint, fee structure, ownership)

OWNS: *.html, sitemap.xml, llms.txt, .gitignore, .unlazy/site-trust/**

Scope: topofmind.me gains a Research Sprint page, an explained fee structure without figures and one identical day-one ownership wording across all pages, all in existing CSS classes, with no price, no client cap and no case study published.

- [x] G1: research.html is a complete page (title, description, canonical, OG, one h1, WebPage + Service JSON-LD without offer data) listed in sitemap.xml and llms.txt
  CHECK: node .unlazy/site-trust/verify.mjs page
  EXPECT: site-trust page verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=b838dc1c0075ba58765c9b36f0a50584f65ded5d86e6e71dab33e888d5c82c8f; exit=0; EXPECT=matched; output-sha256=12a9e6330aa51fc286292e589442534854bec22615378e3aa9418dc99d6b7a2b; output-bytes=36; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G2: the site-nav list is identical in all 10 pages, in the order services, how-you-sell, research, process, team, contact
  CHECK: node .unlazy/site-trust/verify.mjs nav
  EXPECT: site-trust nav verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=92924b4c75e8449e99bc0b4a77349e99d61f2babd1e53cf2bb336ea370766706; exit=0; EXPECT=matched; output-sha256=c48066cbe4f98084e322b9e343a2e1465cb08dcd2f64348a707329c88a734599; output-bytes=35; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G3: every internal href and src, including page#id anchors, resolves to an existing file and id
  CHECK: node .unlazy/site-trust/verify.mjs links
  EXPECT: site-trust links verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=cee64f301325276144429abfb257bd93fe61196e6c88756acd06ca2f210b989e; exit=0; EXPECT=matched; output-sha256=615619b3812ca5781721dce004d26b666134604461b8c983caa564bd1495b8a8; output-bytes=70; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G4: no price figure appears in any page, llms.txt or sitemap, and the price regex is proven against known positive and negative fixtures
  CHECK: node .unlazy/site-trust/verify.mjs noprice
  EXPECT: site-trust noprice verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=c3550018a01b57a1d62609b7520d8e25f0ea005a2ed212604c935576620138e0; exit=0; EXPECT=matched; output-sha256=9d3ed4a78b050148f8b449bf645c584ad724a0a40cffda40a2641070b571d893; output-bytes=39; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G5: the ownership sentence is identical in customer-policy, index, services and contact (FAQ text and JSON-LD), the old "set out in your proposal" ownership wording is gone and the index compare columns are balanced
  CHECK: node .unlazy/site-trust/verify.mjs ownership
  EXPECT: site-trust ownership verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=e50a1dfe84865bbbcd1969d18a906dd5859b83b0f4b292ce11725000c90868be; exit=0; EXPECT=matched; output-sha256=ead1a8763ac129ce70e65487a752ae71b78d97d2784b381da7fa6fee6f793f6a; output-bytes=41; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G6: the result-linked fee structure is explained in services.html#fee without digits and stays consistent in customer-policy and the contact FAQ, with links to it from how-you-sell and index
  CHECK: node .unlazy/site-trust/verify.mjs fee
  EXPECT: site-trust fee verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=df34f9458d9cfb7111ba8ca86ca46a044cf881040fe0bf204e6faaa892167c72; exit=0; EXPECT=matched; output-sha256=dead0ddf18318570df4ea466beaf2bd49eb275645bf47a9968678d5b9a91961f; output-bytes=35; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G7: the Research Sprint deliverables and week rows are verbatim from process.html, and the fixed-price, no-commitment and deduction sentences are identical in research, customer-policy and contact
  CHECK: node .unlazy/site-trust/verify.mjs sprint
  EXPECT: site-trust sprint verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=16d5b5f535300d0e492615dac4dbc5dc6dd63b3422593f340f0be13fe3587ec2; exit=0; EXPECT=matched; output-sha256=c17c27a819973046f6d228044efb2b7e00e1ec34bb1b959d9abd5360aed5d30b; output-bytes=38; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G8: contact.html FAQPage JSON-LD questions and answers equal the visible FAQ one to one, and the case-studies answer is unchanged
  CHECK: node .unlazy/site-trust/verify.mjs faqld
  EXPECT: site-trust faqld verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=957947884733b02ed1112aba41d97386b0f2a0dcb4838e81abf2de51ab15b6de; exit=0; EXPECT=matched; output-sha256=7b1a13bc1058038589332335f062f589c31280af07f4c8312e27bc4bfcc83940; output-bytes=37; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G9: no inline script, style attribute, event handler or external resource was introduced, and every JSON-LD block parses
  CHECK: node .unlazy/site-trust/verify.mjs csp
  EXPECT: site-trust csp verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=401a9e8b09fa82ca9e9f6a40929257caede48ef33aea970150d4e697fd2ea598; exit=0; EXPECT=matched; output-sha256=9feb802d58dc8e2457c53baa79ee5f97332f608aa6e0e707c2c7e94f6b641630; output-bytes=35; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G10: dateModified, sitemap lastmod and the customer-policy "Last updated" line equal 2026-09-30 for every page whose content changed
  CHECK: node .unlazy/site-trust/verify.mjs dates
  EXPECT: site-trust dates verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=d213b8f482af7db4121299c18f63b2f68a1c282d3a0289669142d6e52b0029ed; exit=0; EXPECT=matched; output-sha256=5f3c4b533002b97acdbc9ac297dee933623ebdd7f176d0ad81c4494a629448f4; output-bytes=37; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G11: the three memory files exist with valid frontmatter and each has a pointer in MEMORY.md
  CHECK: node .unlazy/site-trust/verify.mjs memory
  EXPECT: site-trust memory verification passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=87aa04715d39ffd0c3583a49e3502830a95d9ffb469ec48c219f360145ef675e; exit=0; EXPECT=matched; output-sha256=52c368010bbf35d9718d45d2d630e4242e9ebe311862791bec1b65dfe7dc2f8f; output-bytes=38; shell=C:\windows\system32\cmd.exe; cwd=C:\Users\Administrator\Desktop\Top-of-Mind; path=d50cd1c5f9d2/50 entries

- [x] G12: research.html, services.html#fee and the index "How we work" section render correctly at desktop and at phone width, the mobile menu shows the Research link and the browser console has no errors
  EVIDENCE: driver, 2026-09-30, Browser pane on python http.server. Phone 375px: screenshots of research.html (hero, two ways, deliverables list, cost, keep) and services.html#fee; no horizontal overflow on all 10 pages (checked twice, second run after the last edit); index "How we work" checked structurally (5 vs 5 items, "our fee" link present, no overflow) plus one partial screenshot; mobile menu checked structurally (popover open, opaque background, 6 items incl. Research at y=147 inside the viewport), its screenshot was a capture artifact and is not counted. Desktop 1280px: screenshots of research.html two-column block with Research active in the nav, and services.html#fee (24px gap after the modes block); no overflow. Console: no errors on any page visited. Changed during this check: fee table replaced by .modes blocks (table scrolled sideways at 375px) and .stack added for spacing. Not tested: real devices, Safari.

- [ ] G13: the owner has read the new contractual wording in customer-policy.html (Ownership, How we start, Duration and ending) and accepts it
  EVIDENCE: pending
