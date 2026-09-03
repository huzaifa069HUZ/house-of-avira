import os

path = "src/app/quick-note/page.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Import OpenChatbotButton
if "OpenChatbotButton" not in content:
    content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport OpenChatbotButton from '@/components/OpenChatbotButton';")

# 2. Update titles to font-perandory
content = content.replace(
    'className="text-xl md:text-2xl font-bold tracking-widest uppercase text-black mb-4 flex items-center gap-3"',
    'className="text-xl md:text-2xl font-perandory font-bold tracking-widest uppercase text-black mb-4 flex items-center gap-3"'
)

# 3. Replace Read FAQ link with OpenChatbotButton
faq_link = """<Link href="/faq" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#8A001A] hover:shadow-sm transition-all group">
              <span className="text-xs font-bold tracking-wider uppercase text-gray-600 group-hover:text-[#8A001A] font-dm-sans">Read FAQ</span>
            </Link>"""

if faq_link in content:
    content = content.replace(faq_link, "<OpenChatbotButton />")

# 4. Update Continue Shopping button
btn_old = 'className="bg-black text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-[#8A001A] hover:-translate-y-1 transition-all duration-300 shadow-md"'
btn_new = 'className="bg-black text-white px-10 py-3 rounded-xl font-aston-script text-2xl md:text-3xl hover:bg-[#8A001A] hover:-translate-y-1 transition-all duration-300 shadow-md"'

content = content.replace(btn_old, btn_new)
content = content.replace("Continue Shopping", "Continue Shopping") # ensure text casing is nice, wait it's already "Continue Shopping"

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patched quick-note/page.js")
