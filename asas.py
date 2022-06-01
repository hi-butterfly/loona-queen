import json
from pprint import pprint

with open('csv1.json', 'r', encoding="UTF-8") as j:
    data2 = json.loads(j.read())
    for i in data2:
        i['user'] = i['link'].split('twitter.com/')[1].split('/')[0]
        i['link'] = i['link'].split('?s=')[0]

with open('csv1.json', 'w', encoding="UTF-8") as outfile:
    json.dump(data2, outfile, indent=4, ensure_ascii=False)