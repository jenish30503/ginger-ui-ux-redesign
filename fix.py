import os, re

def read(f): return open(f).read()
def write(f,c): open(f,"w").write(c)

auth = read("components/ginger/auth.tsx")
auth = re.sub(r"<DemoNotice message=\"([^\"]+)\" />", r"<DemoNotice>\1</DemoNotice>", auth)
auth = auth.replace("<PendingButton pending={pending} onClick={handleComplete}>", "<Button onClick={handleComplete} disabled={pending}>")
auth = auth.replace("Complete setup <Check className=\"size-4\" />\n              </PendingButton>", "Complete setup <Check className=\"size-4\" />\n              </Button>")
write("components/ginger/auth.tsx", auth)

payments = read("components/ginger/payments.tsx")
payments = re.sub(r"<DemoNotice message=\"([^\"]+)\" />", r"<DemoNotice>\1</DemoNotice>", payments)
write("components/ginger/payments.tsx", payments)

profile = read("components/ginger/profile.tsx")
profile = re.sub(r"<DemoNotice message=\"([^\"]+)\" />", r"<DemoNotice>\1</DemoNotice>", profile)
profile = profile.replace("className=\"size-16 text-lg font-bold\"", "large")
write("components/ginger/profile.tsx", profile)

inbox = read("components/ginger/inbox.tsx")
inbox = inbox.replace("align={m.mine ? 'right' : 'left'}", "align={m.mine ? 'end' : 'start'}")
write("components/ginger/inbox.tsx", inbox)

print("done script")
