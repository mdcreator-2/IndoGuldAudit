import os
import re

html_files = ['index.html', 'about.html', 'contact.html', 'uae-services.html', 'audit-outsourcing.html', 'company-formation.html']

replacement = '''<div class="text-sm leading-relaxed text-slate-400 space-y-4">
                    <div>
                        <span class="text-slate-200 font-bold block">Operated by Adi And Company</span>
                        <span class="text-xs">GSTIN: 07FGYPS4118C1ZZ</span>
                    </div>
                    <p>Professional Accounting, Bookkeeping, GST, Taxation and E-Commerce Financial Support Services.</p>
                    <div>
                        <span class="text-slate-300 font-semibold text-xs block">Registered Office:</span>
                        <p class="text-xs mt-1">S-16, Jogai Bai Extension, Jamia Nagar, Okhla, New Delhi – 110025, India</p>
                    </div>
                </div>'''

pattern = re.compile(r'<p class="text-sm leading-relaxed text-slate-400">.*?</p>', re.DOTALL)

for f in html_files:
    path = os.path.join(r'p:\Projects\IndoGuldAudit', f)
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = pattern.sub(replacement, content)
    
    with open(path, 'w', encoding='utf-8') as file:
        file.write(content)
print('Done!')
