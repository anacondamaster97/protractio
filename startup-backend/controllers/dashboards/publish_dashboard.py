def publish_dashboard(dashboardId, data):
    data['id'] = dashboardId
    print(data)
    return True