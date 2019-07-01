import requests
import json
def getMovie():
    for i in range(90):
        url = "https://cctv12306.net/user/getPage?page={}&on_type=all".format(i)
        response = requests.get(url)
        if response.status_code == 200:
            items = response.json().replace("番號V","")

            anyOf = json.loads(items).get("anyOf")
            if anyOf and len(anyOf) > 0:
               for j in range(len(anyOf)):
                   name = anyOf[j].get("name")
                   duration = anyOf[j].get("time")
                   print("时长{}，电影名{}".format(duration,name))


getMovie()