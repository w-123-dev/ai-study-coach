import codecs
content = codecs.open("app/setup/page.tsx", "r", "utf-8").read()
old = codecs.decode(b'ICAgIC8vIOeUny.iorlr7zlh7rorr7ljZY=',
    'base64').decode('utf-8') + '\n' + \
    '    setGenerating(true);\n    for (let retry = 0; retry < 5; retry++) {\n' + \
    '      try {\n        const res = await fetch("/api/plan/generate", { method: "POST" });\n' + \
    '        if (res.ok) break;\n      } catch {}\n' + \
    '      await new Promise((r) => setTimeout(r, 1000));\n    }\n\n'
new = '    // plan generation moved to plan-success page\n\n'
content = content.replace(old, new, 1)
codecs.open("app/setup/page.tsx", "w", "utf-8").write(content)
print("OK")
